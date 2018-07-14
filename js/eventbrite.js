app.eventbrite = function () {

    const server = {
        authorizeEndpoint: 'https://www.eventbrite.com/oauth/authorize?',
        response_type: 'token',
        userEndpoint: 'https://www.eventbriteapi.com/v3/events/search/',
        profileEndpoint: 'https://www.eventbriteapi.com/v3/users/me/',
        category: 'https://www.eventbriteapi.com/v3/categories'
    };

    const oAuth = {};

    const userSeedData = {};

    console.log("Inside eventbrite global");

    // Show "Login to Explore" form if no token; show Explore form if there is
    function toggleEventbriteForm () {
        console.log("toggleEventbriteForm ran!")
    }

    // Generate Eventbrite with event information
    function generateEventbriteEvents() {
        // event, event.venue_id
        // to get venue address url: https://www.eventbriteapi.com/v3/venues/${data.events[0].venue_id}/
        console.log('generateEventbriteEvents ran!');
        $('.results-btn-image').css({
            "background-image": `url('${userSeedData.eventbrite[0].logo.original.url}')`
        });
        $('.result-title').text(`${userSeedData.eventbrite[0].name.text}`);
        appendEventbriteEvents();
    }

    function appendEventbriteEvents () {
        console.log('appendEventbriteEvents ran!');
        // should append the Eventbrite elements to the DOM
    }

    // Seed with Eventbrite data based on user location
    function seedEventbriteEvents () {
        const settings = {
            url: 'https://www.eventbriteapi.com/v3/events/search/',
            data: {
                ['location.address']: data.seed.city
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${oAuth.access_token}`);
            }
        };
        $.ajax(settings).done(function (data) {
            userSeedData.eventbrite = [];
            data.events.forEach(event => {
                // push events to userSeedData object
                // console.log(event);
                userSeedData.eventbrite.push(event);
            });
            generateEventbriteEvents();
        }).fail(function (e) {
            console.log(e.statusText, e.responseText, "Call failed!");
        });
    }

    // On page load, check if there is OAuth authentication token
    // If not, login to be redirected to authorization server to obtain OAuth token
    function oAuthAuthenticate () {
        if (window.location.hash) {
            const hash = window.location.hash;
            oAuth.access_token = hash.split('=')[2];
        } else {
            $('#js-eventbrite-login').on('click', function () {
                window.location.replace(`${server.authorizeEndpoint}response_type=${server.response_type}&client_id=${config.eventbrite.key}`);
            });
        }
    };

    // Always make requests with user's OAuth token
    function requestEventbriteData (settings) {
        const test = {
            url: 'https://www.eventbriteapi.com/v3/events/search/',
            data: {
                q: 'jazz',
                ['location.address']: 'Redwood City, ca'
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${oAuth.access_token}`);
            }
        };
        $.ajax(test).done(function (data) {
            console.log(data, data.events);
            console.log(data.events[2].venue_id)
        });
    }

    $('#js-explore-event').on('click', function () {
        requestEventbriteData ();
    });

    function main () {
        oAuthAuthenticate();
        seedEventbriteEvents();
    }

    $(main);
};