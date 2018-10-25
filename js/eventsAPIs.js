app.eventsAPIs = function () {
    'use strict';

    const eventbriteEndpoint = {
        userEndpoint: 'https://www.eventbriteapi.com/v3/events/search/',
        page_number: 1
    };

    const foursquareEndpoints = {
        explore: 'https://api.foursquare.com/v2/venues/explore',
        venues: 'https://api.foursquare.com/v2/venues/'
    };

    const page = {
        page_number: 1,
        pageNumberTotal: null,
        pageObjectCount: null,
        storePagination: function (pagination) {
            this.pageNumberTotal = pagination.page_count;
            this.pageObjectCount = pagination.object_count;
        }
    };

    function getEBdefaultData() {
        const settings = {
            url: eventbriteEndpoint.userEndpoint,
            data: {
                q: 'jazz',
                ['location.address']: 'San Francisco',
                ['start_date.keyword']: $('#date').val(),
                ['location.within']: '25mi',
                page: page.page_number
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${config.eventbrite.oAuth}`);
            }
        };

        makeAJAXCall(settings, 'eventbrite', false);
    }

    // Seed with Recommended places data based on user location on page load
    function getFSDefaultData() {
        const settings = {
            url: foursquareEndpoints.explore,
            data: {
                near: 'San Francisco',
                client_id: config.fourSquare.id2,
                client_secret: config.fourSquare.secret2,
                section: 'food',
                limit: 10,
                v: '20180323'
            }
        };

        makeAJAXCall(settings, 'foursquare');
    }

    function requestEventbriteData(bool) {
        const { location, term, dataRange } = getFormData();

        const settings = {
            url: eventbriteEndpoint.userEndpoint,
            data: {
                q: term !== '' ? term : 'jazz',
                ['location.address']: location !== '' ? location : 'San Francisco',
                ['start_date.keyword']: $('#date').val(),
                ['location.within']: '25mi',
                page: page.page_number
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${config.eventbrite.oAuth}`);
            }
        };

        // No calling Foursquare API if bool is false--not a form submission
        makeAJAXCall(settings, 'eventbrite', bool);
    }

    function getFormData() {
        return {
            location: $('#location').val(),
            term: $('#search').val(),
            dateRange: $('#date').val()
        };
    }

    function requestFoursquareData(location) {
        const settings = {
            url: foursquareEndpoints.explore,
            data: {
                ll: `${location.latitude}, ${location.longitude}`,
                client_id: config.fourSquare.id2,
                client_secret: config.fourSquare.secret2,
                section: 'food',
                limit: 10,
                v: '20180323'
            }
        };

        makeAJAXCall(settings, 'foursquare');
    }

    function makeAJAXCall(settings, source, isNewSubmission) {
        const promise = $.ajax(settings);

        if (source === 'eventbrite') {
            promise.done(function (data) {
                const { events, location, pagination } = data;
                handlePagination(pagination);
                handleLocation(location);
                containsEvents(events);

                if (isNewSubmission) {
                    requestFoursquareData(location);
                    console.count('Requesting Foursquare!');
                }
            });

        }

        if (source === 'foursquare') {
            promise.done(function (response) {
                const venues = response.response.groups[0].items;
                generatePlacesMarkup(venues);
            });
        }

        promise.fail(function (e) {
            console.log(e.statusText, e.responseText, 'Call failed!');
        });
    }

    function containsEvents(events) {
        if (events && events.length !== 0) {
            generateEventsMarkup(events);
        } else {
            $('.results-count').html('0 results');
            $('.js-autho-results').html('Eventbrite found no events matching your search.');
            return;
        }
    }

    // Generate Eventbrite with event information
    function generateEventsMarkup(events) {
        $('.js-autho-results').html('');

        const results = events.forEach(function (event, i) {
            const image = event.logo === null ? 'https://azureowl.github.io/good-times-eventbrite-foursquare-ipstack-darksky-capstone/images/no-image-available.jpg' : event.logo.original.url;
            const title = event.name.text ? event.name.text : 'No Title';
            const id = event.venue_id;
            const html = `<div class="col col-4 results-margin"><div class="results-cell"><a href="${event.url}" target="_blank" class="results-link-image"><img src="${image}" alt="Photos of event ${title}"></a><div class="venue-info"><p class="result-title">${title}</p>`;
            if (id !== undefined) {
                getVenueDetailsEventbrite(html, id);
            }
        });
    }

    // Generate Foursquare with places information
    function generatePlacesMarkup(venues) {
        $('.js-foursq-results').html('');

        const results = venues.forEach(function (place, i) {
            const placeholder = '../images/no-image-available.jpg';
            const venueName = place.venue.name ? place.venue.name : 'No Title';
            const venueAdd = `${place.venue.location.address}, ${place.venue.location.city}`;
            const html = `<div class="venue-info"><p class="result-title">${venueName}</p><p class="result-add">${venueAdd}</p></div></div></div>`;
            getVenueDetailsFoursquare(place.venue.id, html, venueName);
        });
    }

    function getVenueDetailsFoursquare(venueID, html, venueName) {
        const query = {
            client_id: config.fourSquare.id2,
            client_secret: config.fourSquare.secret2,
            v: '20180323'
        };

        $.getJSON(`${foursquareEndpoints.venues}/${venueID}`, query, function (place) {
            const url = place.response.venue.canonicalUrl;
            getVenuePhotosFoursquare(venueID, html, url, venueName);
        }).fail(function (error) {
            console.log(error);
        });
    }

    function getVenuePhotosFoursquare(venueID, html, url, venueName) {
        const query = {
            client_id: config.fourSquare.id2,
            client_secret: config.fourSquare.secret2,
            limit: 10,
            v: '20180323'
        };

        $.getJSON(`${foursquareEndpoints.venues}/${venueID}/photos`, query, function (photoData) {
            const image = `${photoData.response.photos.items[0].prefix}width600${photoData.response.photos.items[0].suffix}`;
            const joinedHTML = `<div class="col col-4 results-margin"><div class="results-cell"><a href="${url}" target="_blank" class="results-link-image"><img src="${image}" alt="Photo of ${venueName}"></a>${html}`;
            appendFoursquarePlaces(joinedHTML);
        }).fail(function (error) {
            console.log(error);
        });
    }

    // Gets venue address
    function getVenueDetailsEventbrite(html, id) {
        const settings = {
            url: `https://www.eventbriteapi.com/v3/venues/${id}/`,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', `Bearer ${config.eventbrite.oAuth}`);
            }
        };
        $.ajax(settings).done(function (data) {
            const joinedHTML = `${html}<p class="result-add">${data.address.localized_address_display}</p></div></div></div>`;
            appendEventbriteEvents(joinedHTML);
        }).fail(function (error) {
            console.log(error.responseJSON.error_description);
        });
    }

    function appendEventbriteEvents(html) {
        $('.results-count').html(`${page.pageObjectCount} results`);
        pageCountDisplay();
        $('.js-autho-results').append(html);
    }

    function appendFoursquarePlaces(html) {
        $('.js-foursq-results').append(html);
    }

    function handlePagination(pagination) {
        togglePaginationButtons();
        page.storePagination(pagination);
        pageCountDisplay();
    }

    function handleLocation(location) {
        app.darksky.makeRequest(location.latitude, location.longitude);
        updateLocationHeading(location);
    }

    function updateLocationHeading(location) {
        const city_region = location.augmented_location.city !== undefined ? location.augmented_location.city : location.augmented_location.region;
        const country = getCountryCode(location.augmented_location.country);
        $('.js-user-loc').html(`${city_region}, ${country}`);
    }

    function pageCountDisplay() {
        $('.js-current-page').html(`${page.page_number}`);
        $('.js-total-page').html(`${page.pageNumberTotal}`);
    }

    $('.main-form').on('submit', function (e) {
        e.preventDefault();
        page.page_number = 1;
        $('.top-match').html('');
        requestEventbriteData(true);
    });

    $('.js-next').on('click', function () {
        if (page.page_number < page.pageNumberTotal) {
            page.page_number += 1;
            requestEventbriteData(false);
        }
    });

    $('.js-prev').on('click', function () {
        if (page.page_number > 1) {
            page.page_number -= 1;
            requestEventbriteData(false);
        }
    });

    function togglePaginationButtons() {
        if (page.page_number === 1) {
            $('.js-prev').hide();
        }
        if (page.page_number > 1) {
            $('.js-prev').show();
        }
        if (page.page_number === page.pageNumberTotal) {
            $('.js-next').hide();
        }
        if (page.page_number < page.pageNumberTotal) {
            $('.js-next').show();
        }
    }

    function main() {
        getEBdefaultData();
        getFSDefaultData();
    }

    $(main);
};