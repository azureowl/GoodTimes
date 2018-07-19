app.eventbrite = function () {

    const server = {
        authorizeEndpoint: 'https://www.eventbrite.com/oauth/authorize?',
        response_type: 'token',
        userEndpoint: 'https://www.eventbriteapi.com/v3/events/search/',
        profileEndpoint: 'https://www.eventbriteapi.com/v3/users/me/',
        page_number: 1,
        call: 1
    };

    // Generate Eventbrite with event information
    function generateEventsMarkup(data) {
        let events;
        console.log(data);
        if (data.events && data.events.length !== 0) {
            events = data.events;
        } else if (data.top_match_events && data.top_match_events.length !== 0) {
            events = data.top_match_events;
            $('.top-match').html("There are no exact matches. What about these events?");
        } else {
            $('.js-autho-results').html('No results found');
            return;
        }

        $('.js-autho-results').html('');

        const results = events.forEach(function (event, i) {
            const image = event.logo === null ? "../images/no-image-available.jpg" : event.logo.original.url;
            const title = event.name.text ? event.name.text : "No Title";
            const id = event.venue_id;
            const html = `<div class="col col-4 results-margin"><div class="results-cell"><button class="results-btn-image"><img src="${image}" alt=""></button><div class="venue-info"><p class="result-title">${title}</p>`;
            getVenueDetails(html, id);
        });
    }

    // Gets venue address
    function getVenueDetails (html, id) {
        const settings = {
            url: `https://www.eventbriteapi.com/v3/venues/${id}/`,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${config.eventbrite.oAuth}`);
            }
        };
        $.ajax(settings).done(function (data) {
            const joinedHTML = `${html}<p class="result-add">${data.address.localized_address_display}</p></div></div></div>`;
            appendEventbriteEvents(joinedHTML);
        });
    }

    function appendEventbriteEvents (html) {
        $('.results-count').html(`${server.pageObjectCount} results`);
        $('.js-autho-results').append(html);
    }

    // Seed with Eventbrite data based on user location
    function seedEventbriteEvents (page) {
        const settings = {
            url: 'https://www.eventbriteapi.com/v3/events/search/',
            data: {
                // q: '',
                q: 'jazz',
                // ['location.address']: data.seed.city,
                ['location.address']: 'new york',
                ['location.within']: '25mi',
                page: server.page_number
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${config.eventbrite.oAuth}`);
            }
        };
        makeAJAXCall(settings, false);
    }


    function makeAJAXCall (settings, bool) {
        $.ajax(settings).done(function (data) {
            console.log(data);

            if (server.call === 1) {
                server.pageNumberTotal = data.pagination.page_count;
                server.pageObjectCount = data.pagination.object_count;
            }

            if (bool) {
                const mainLoc = data.location.augmented_location.city ? data.location.augmented_location.city : data.location.augmented_location.region;
                const country = getCountryCode(data.location.augmented_location.country);
                app.darksky.getLocalWeather(data.location.latitude, data.location.longitude);
                updateLocationHeading(mainLoc, country);
            }
            generateEventsMarkup(data);
        }).fail(function (e) {
            console.log(e.statusText, e.responseText, "Call failed!");
        });
    }

    $('form').on('submit', function (e) {
        e.preventDefault();
        server.page_number = 1;
        requestEventbriteData();
    });

    $('.js-next').on('click', function () {
        if (server.page_number < server.pageNumberTotal) {
            server.page_number += 1;
            requestEventbriteData();
        }
    });

    $('.js-prev').on('click', function () {
        if (server.page_number > 1) {
            server.page_number -= 1;
            requestEventbriteData();
        }
    });

    // On page load, check if there is OAuth authentication token
    // If not, login to be redirected to authorization server to obtain OAuth token
    // function oAuthAuthenticate () {
    //     if (window.location.hash) {
    //         const hash = window.location.hash;
    //         oAuth.access_token = hash.split('=')[2];
    //         seedEventbriteEvents();
    //         $('.js-hide').removeClass('js-hide');
    //         $('.js-hide-noAutho').css({
    //             display: 'none'
    //         });
    //     } else {
    //         $('#js-eventbrite-login').on('click', function () {
    //             window.location.replace(`${server.authorizeEndpoint}response_type=${server.response_type}&client_id=${config.eventbrite.key}`);
    //         });
    //     }
    // };

    // Always make requests with user's OAuth token
    function requestEventbriteData () {
        const location = $('#location').val();
        const settings = {
            url: 'https://www.eventbriteapi.com/v3/events/search/',
            data: {
                q: $('#search').val(),
                // q: 'jazz',
                ['location.address']: location !== "" ? location : data.seed.city,
                // ['location.address']: 'new york',
                ['start_date.keyword']: $("#date").val(),
                ['location.within']: '50mi',
                page: server.page_number
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${config.eventbrite.oAuth}`);
            }
        };
        makeAJAXCall(settings, true);
    }

    function updateLocationHeading (mainLoc, country) {
        const html = `${mainLoc}, ${country}`;
        $('.user-loc').html(html);
    }

    function main () {
        seedEventbriteEvents();
    }

    $(main);
};