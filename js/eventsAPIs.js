'use strict';

app.eventsAPIs = function () {

    const eventbriteEndpoint = {
        userEndpoint: 'https://www.eventbriteapi.com/v3/events/search/',
        page_number: 1
    };

    const foursquareEndpoints = {
        explore: 'https://api.foursquare.com/v2/venues/explore',
        venues: 'https://api.foursquare.com/v2/venues/'
    };

    // Seed with Eventbrite data based on user location on page load
    function seedEventbriteEvents (page) {
        const settings = {
            url: eventbriteEndpoint.userEndpoint,
            data: {
                q: 'jazz',
                ['location.address']: storedData.seed.city,
                ['start_date.keyword']: $("#date").val(),
                ['location.within']: '25mi',
                page: storedData.server.page_number
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${config.eventbrite.oAuth}`);
            }
        };

        eventbriteMakeAJAXCall(settings, false);
    }

    // Seed with Recommended places data based on user location on page load
    function seedFoursquarePlaces () {
        const query = {
            near: storedData.seed.city,
            client_id: config.fourSquare.id,
            client_secret: config.fourSquare.secret,
            section: 'food',
            limit: 10,
            v: '20180323'
        };

        foursquareMakeAJAXCall(query);
    }

    function requestEventbriteData (bool) {
        const location = $('#location').val();
        const term = $('#search').val();
        const dateRange = $("#date").val();
        const settings = {
            url: eventbriteEndpoint.userEndpoint,
            data: {
                q: term !== "" ? term : storedData.seed.term,
                ['location.address']: location !== "" ? location : storedData.seed.city,
                ['start_date.keyword']: $("#date").val(),
                ['location.within']: '25mi',
                page: storedData.server.page_number
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${config.eventbrite.oAuth}`);
            }
        };

        if (bool) {
            eventbriteMakeAJAXCall(settings, true);
        } else {
            // Prevent calling Foursquare API if just paginating through results
            eventbriteMakeAJAXCall(settings, false);
        }
    }

    function requestFoursquareData () {
        const query = {
            ll: `${storedData.server.location.latitude},${storedData.server.location.longitude}`,
            limit: 10,
            client_id: config.fourSquare.id,
            section: 'food',
            client_secret: config.fourSquare.secret,
            v: '20180323'
        };

        foursquareMakeAJAXCall(query);
    };

    function eventbriteMakeAJAXCall (settings, bool) {

        $.ajax(settings).done(function (data) {
            storeData(storedData.server, data);
            getStoredLocData();
            togglePaginationButtons();
            pageCountDisplay();

            if (bool) {
                requestFoursquareData();
            }

            checkIfEventArrayExist(data);

        }).fail(function (e) {
            console.log(e.statusText, e.responseText, "Call failed!");
        });
    }

    function foursquareMakeAJAXCall (query) {
        $.getJSON(foursquareEndpoints.explore, query, function (response) {
            const venues = response.response.groups[0].items;
            generatePlacesMarkup(venues);
        }).fail(function (error) {
            console.log(error);
        });
    }

    function storeData (obj, data) {
        obj.pageNumberTotal = data.pagination.page_count;
        obj.pageObjectCount = data.pagination.object_count;
        obj.location = { latitude: data.location.latitude };
        obj.location.longitude = data.location.longitude;
        obj.location.currentLocation = data.location.augmented_location.city ? data.location.augmented_location.city : data.location.augmented_location.region;
        obj.location.country = getCountryCode(data.location.augmented_location.country);
    }

    function getStoredLocData () {
        app.darksky.getLocalWeatherSearch(storedData.server.location.latitude, storedData.server.location.longitude);
        updateLocationHeading(storedData.server.location.currentLocation, storedData.server.location.country);
    }

    function checkIfEventArrayExist (data) {
        let events;
        if (data.events && data.events.length !== 0) {
            events = data.events;
        } else if (data.top_match_events && data.top_match_events.length !== 0) {
            events = data.top_match_events;
            $('.top-match').html("There are no exact matches. What about these events?");
        } else {
            $('.results-count').html('0 results');
            $('.js-autho-results').html('Eventbrite found no results.');
            return;
        }
        generateEventsMarkup(events);
    }

    // Generate Eventbrite with event information
    function generateEventsMarkup(events) {
        $('.js-autho-results').html('');

        const results = events.forEach(function (event, i) {
            const image = event.logo === null ? "https://azureowl.github.io/good-times-eventbrite-foursquare-ipstack-darksky-capstone/images/no-image-available.jpg" : event.logo.original.url;
            const title = event.name.text ? event.name.text : "No Title";
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
            const placeholder = "../images/no-image-available.jpg";
            const venueName = place.venue.name ? place.venue.name : "No Title";
            const venueAdd = `${place.venue.location.address}, ${place.venue.location.city}`;
            const html = `<div class="venue-info"><p class="result-title">${venueName}</p><p class="result-add">${venueAdd}</p></div></div></div>`;
            getVenueDetailsFoursquare(place.venue.id, html, venueName);
        });
    }

    function getVenueDetailsFoursquare (venueID, html, venueName) {
        const query = {
            client_id: config.fourSquare.id,
            client_secret: config.fourSquare.secret,
            v: '20180323'
        };

        $.getJSON(`${foursquareEndpoints.venues}/${venueID}`, query, function (place) {
            const url = place.response.venue.canonicalUrl;
            getVenuePhotosFoursquare(venueID, html, url, venueName);
        }).fail(function (error) {
            console.log(error);
        });
    }

       function getVenuePhotosFoursquare (venueID, html, url, venueName) {
        const query = {
            client_id: config.fourSquare.id,
            client_secret: config.fourSquare.secret,
            limit: 10,
            v: '20180323'
        };

        $.getJSON(`${foursquareEndpoints.venues}/${venueID}/photos`, query, function (photoData) {
            const image = `${photoData.response.photos.items[0].prefix}width600${photoData.response.photos.items[0].suffix}`;
            const joinedHTML = `<div class="col col-4 results-margin"><div class="results-cell"><a href="${url}" target="_blank" class="results-link-image"><img src="${image}" alt="Photo of ${venueName}"></a>${html}`;
            appendFoursquarePlaces(joinedHTML);
        }).fail(function (error) {
            console.log(error);
        });;
    }

    // Gets venue address
    function getVenueDetailsEventbrite (html, id) {
        const settings = {
            url: `https://www.eventbriteapi.com/v3/venues/${id}/`,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${config.eventbrite.oAuth}`);
            }
        };
        $.ajax(settings).done(function (data) {
            const joinedHTML = `${html}<p class="result-add">${data.address.localized_address_display}</p></div></div></div>`;
            appendEventbriteEvents(joinedHTML);
        }).fail(function (error) {
            console.log(error.responseJSON.error_description);
        });
    }

    function appendEventbriteEvents (html) {
        $('.results-count').html(`${storedData.server.pageObjectCount} results`);
        pageCountDisplay();
        $('.js-autho-results').append(html);
    }

    function appendFoursquarePlaces (html) {
        $('.js-foursq-results').append(html);
    }

    function updateLocationHeading (city_region, country) {
        const html = `${city_region}, ${country}`;
        $('.js-user-loc').html(html);
    }

    function pageCountDisplay () {
        $('.js-current-page').html(`${storedData.server.page_number}`);
        $('.js-total-page').html(`${storedData.server.pageNumberTotal}`);
    }

    $('.main-form').on('submit', function (e) {
        e.preventDefault();
        storedData.server.page_number = 1;
        $('.top-match').html('');
        requestEventbriteData(true);
    });

    $('.js-next').on('click', function () {
        if (storedData.server.page_number < storedData.server.pageNumberTotal) {
            storedData.server.page_number += 1;
            requestEventbriteData(false);
        }
    });

    $('.js-prev').on('click', function () {
        if (storedData.server.page_number > 1) {
            storedData.server.page_number -= 1;
            requestEventbriteData(false);
        }
    });

    function togglePaginationButtons () {
        if (storedData.server.page_number === 1) {
            $('.js-prev').hide();
        }
        if (storedData.server.page_number > 1) {
            $('.js-prev').show();
        }
        if (storedData.server.page_number === storedData.server.pageNumberTotal) {
            $('.js-next').hide();
        }
        if (storedData.server.page_number < storedData.server.pageNumberTotal) {
            $('.js-next').show();
        }
    }

    function main () {
        seedEventbriteEvents();
        seedFoursquarePlaces();
    }

    $(main);
};