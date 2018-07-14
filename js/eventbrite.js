app.eventbrite = function () {

    const server = {
        authorizeEndpoint: 'https://www.eventbrite.com/oauth/authorize?',
        response_type: 'token',
        userEndpoint: 'https://www.eventbriteapi.com/v3/events/search/',
        profileEndpoint: 'https://www.eventbriteapi.com/v3/users/me/',
        category: 'https://www.eventbriteapi.com/v3/categories',
        page_number: 1
    };

    const oAuth = {};

    const userSeedData = {};

    console.log("Inside eventbrite global");

    // Show "Login to Explore" form if no token; show Explore form if there is
    function toggleEventbriteForm () {
        console.log("toggleEventbriteForm ran!")
    }

    // Generate Eventbrite with event information
    function generateEventsMarkup(data) {
        const events = data.events;
        // call getVenueDetails()
        const results = events.map(function (event, i) {
            const image = event.logo === null ? "../images/no-image-available.jpg" : event.logo.original.url;
            const title = event.name.text ? event.name.text : "No Title";
            return `<div class="col col-4 results-margin"><div class="results-cell"><button class="results-btn-image"><img src="${image}" alt=""></button><p class="result-title">${title}</p></div></div>`
        });

        appendEventbriteEvents(results)
    }

    function appendEventbriteEvents (results) {
        let eventResults = results.join('');
        $('.js-autho-results').html(eventResults);
        console.log('appendEventbriteEvents ran!');
    }

    // should get venue address
    function getVenueDetails () {
        // event, event.venue_id
        // to get venue address url: https://www.eventbriteapi.com/v3/venues/${data.events[0].venue_id}/
        // call a function to get venue address
    }

    // Seed with Eventbrite data based on user location
    // page param is just to test executePagination
    // need to always have current search term; it should still be on the form
    // using seedEventbriteEvents to test executePagination()
    function seedEventbriteEvents (page) {
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
            // userSeedData.eventbrite = [];
            console.log(data);
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

    // should be able to page through
    // Refactor; right now, only brings up seeded events
    function executePagination (paginationData) {
        console.log('executePagination ran!');
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
            // call function to generate eventbrite markup
        } else {
            // make sure a please login into eventbrite is displayed in the eventbrite section
            // see .js-autho-results in index.html
            $('#js-eventbrite-login').on('click', function () {
                window.location.replace(`${server.authorizeEndpoint}response_type=${server.response_type}&client_id=${config.eventbrite.key}`);
            });
        }
    };

    // Always make requests with user's OAuth token
    function requestEventbriteData () {
        const settings = {
            url: 'https://www.eventbriteapi.com/v3/events/search/',
            data: {
                q: $('#search').val(),
                ['location.address']: data.seed.city,
                page: server.page_number
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${oAuth.access_token}`);
            }
        };
        $.ajax(settings).done(function (data) {
            console.log($('#search').val(), data);
            executePagination(data.pagination);
            generateEventsMarkup(data);
        }).fail(function (e) {
            console.log(e.statusText, e.responseText, "Call failed!");
        });
    }

    $('#js-explore-event').on('click', function () {
        submitForm();
        requestEventbriteData();
    });

    function main () {
        oAuthAuthenticate();
        seedEventbriteEvents();
    }

    $(main);
};