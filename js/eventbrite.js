app.eventbrite = function () {

    const server = {
        authorizeEndpoint: 'https://www.eventbrite.com/oauth/authorize?',
        response_type: 'token',
        userEndpoint: 'https://www.eventbriteapi.com/v3/events/search/',
        profileEndpoint: 'https://www.eventbriteapi.com/v3/users/me/',
        page_number: 1
    };

    const oAuth = {};

    // Generate Eventbrite with event information
    function generateEventsMarkup(data) {
        const events = data.events.length !== 0 ? data.events : data.top_match_events;
        $('.js-autho-results').html('');
        const results = events.forEach(function (event, i) {
            const eventDetails = {
                image: event.logo === null ? "../images/no-image-available.jpg" : event.logo.original.url,
                title: event.name.text ? event.name.text : "No Title",
                id: event.venue_id
            };
            getVenueDetails(eventDetails);
        });
    }

    function appendEventbriteEvents (html) {
        $('.js-autho-results').append(html);
        console.log('appendEventbriteEvents ran!');
    }

    // should get venue address
    function getVenueDetails (venueObj) {

        const settings = {
            url: `https://www.eventbriteapi.com/v3/venues/${venueObj.id}/`,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${oAuth.access_token}`);
            }
        };
        $.ajax(settings).done(function (venueData) {
            const html = `<div class="col col-4 results-margin"><div class="results-cell"><button class="results-btn-image"><img src="${venueObj.image}" alt=""></button><div class="venue-info"><p class="result-title">${venueObj.title}</p><p class="result-add">${venueData.address.localized_address_display}</p></div></div></div>`;
            appendEventbriteEvents(html);
        });
    }

    // Seed with Eventbrite data based on user location
    // page param is just to test executePagination
    // need to always have current search term; it should still be on the form
    // using seedEventbriteEvents to test executePagination()
    function seedEventbriteEvents (page) {
        console.log('seedEventbriteEvents ran!');
        const settings = {
            url: 'https://www.eventbriteapi.com/v3/events/search/',
            data: {
                q: '',
                ['location.address']: data.seed.city,
                page: server.page_number
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${oAuth.access_token}`);
            }
        };
        $.ajax(settings).done(function (data) {
            generateEventsMarkup(data);
            executePagination(data.pagination);
        }).fail(function (e) {
            console.log(e.statusText, e.responseText, "Call failed!");
        });
    }

    // clear search on submit of form
    function submitForm () {
        console.log('Inside submitForm!');
        server.page_number = 1;
        $('form').on('submit', function (e) {
            e.preventDefault();
        });
    }

    function executePagination (paginationData) {
        const pageNumberTotal = paginationData.page_count;
            $('.js-next').on('click', function () {
                if (server.page_number <= pageNumberTotal) {
                    server.page_number += 1;
                    console.log(server.page_number);
                    requestEventbriteData();
                }
            });

            $('.js-prev').on('click', function () {
                if (server.page_number > 1) {
                    server.page_number -= 1;
                    console.log(server.page_number);
                    requestEventbriteData();
                }
            });
    }

    // On page load, check if there is OAuth authentication token
    // If not, login to be redirected to authorization server to obtain OAuth token
    function oAuthAuthenticate () {
        if (window.location.hash) {
            const hash = window.location.hash;
            oAuth.access_token = hash.split('=')[2];
            seedEventbriteEvents();
            $('.js-hide').removeClass('js-hide');
            $('.js-hide-noAutho').css({
                display: 'none'
            });
        } else {
            $('#js-eventbrite-login').on('click', function () {
                window.location.replace(`${server.authorizeEndpoint}response_type=${server.response_type}&client_id=${config.eventbrite.key}`);
            });
        }
    };

    // Always make requests with user's OAuth token
    function requestEventbriteData () {
        const location = $('#location').val();
        const settings = {
            url: 'https://www.eventbriteapi.com/v3/events/search/',
            data: {
                q: $('#search').val(),
                ['location.address']: location !== "" ? location : data.seed.city,
                ['start_date.keyword']: $("#date").val(),
                page: server.page_number
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${oAuth.access_token}`);
            }
        };
        $.ajax(settings).done(function (data) {
            executePagination(data.pagination);
            generateEventsMarkup(data);
            console.log(data);
            updateLocationHeading(data.location.augmented_location.city);
        }).fail(function (e) {
            console.log(e.statusText, e.responseText, "Call failed!");
        });
    }

    function updateLocationHeading (city) {
        $('.user-loc').html(city);
    }

    $('#js-explore-event').on('click', function () {
        submitForm();
        requestEventbriteData();
    });

    function main () {
        oAuthAuthenticate();
    }

    $(main);
};