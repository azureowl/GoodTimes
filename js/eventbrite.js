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

    function getUserLoc () {
        $.getJSON(`http://api.ipstack.com/check?access_key=${config.ipstack.key}`, function (response) {
            console.log(response);
            seedEventbriteEvents(response);
        });
    }

    // Seed events below Eventbrite form
    function seedEventbriteEvents (response) {
        console.log("seedEventbriteEvents ran!")
        // seed div with eventbrite data based on user location
        // ipstack
        const test = {
            url: 'https://www.eventbriteapi.com/v3/events/search/',
            data: {
                ['location.address']: response.city
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${oAuth.access_token}`);
            }
        };
        $.ajax(test).done(function (data) {
            console.log(data.events);
            data.events.forEach(event => {
                // console.log(event);
                // need venue_id to get address
                // to get venue address url: https://www.eventbriteapi.com/v3/venues/${data.events[0].venue_id}/
            });
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
        getUserLoc();
    }

    $(main);
};