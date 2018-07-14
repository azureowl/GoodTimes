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
    function generateEventbriteEvents(data) {
        // event, event.venue_id
        // to get venue address url: https://www.eventbriteapi.com/v3/venues/${data.events[0].venue_id}/
        console.log('generateEventbriteEvents ran!');
        // console.log(userSeedData.eventbrite);
        // .js-autho-results append
        console.log(data.events, 'hii');
        const events = data.events;
        let columns = 0;

        `<div class="col col-4 results-margin">
            <div class="results-cell">
                <button class="results-btn-image"><img src="" alt=""></button>
                <p class="result-title">Test</p>
            </div>
        </div>`
        // when columns hits 3, then re-create inner-row-mb div

        const results = events.map(function (event, i) {

            const image = event.logo === null ? "" : event.logo.original.url;
            const title = event.name.text ? event.name.text : "No Title";

            // image is null then do something
            return `<div class="col col-4 results-margin"><div class="results-cell"><button class="results-btn-image"><img src="${image}" alt=""></button><p class="result-title">${title}</p></div></div>`
        });

        let eventResults = results.join('');
        $('.test1').append(eventResults);


        // $('.results-btn-image').css({
        //     "background-image": `url('${userSeedData.eventbrite[0].logo.original.url}')`
        // });

        // $('.result-title').text(`${userSeedData.eventbrite[0].name.text}`);
        // appendEventbriteEvents();
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
                ['location.address']: data.seed.city,
                page: 1
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${oAuth.access_token}`);
            }
        };
        $.ajax(settings).done(function (data) {
            // userSeedData.eventbrite = [];
            console.log(data);
            // data.events.forEach(event => {
            //     // push events to userSeedData object
            //     // console.log(event);
            //     userSeedData.eventbrite.push(event);
            // });
            generateEventbriteEvents(data);
        }).fail(function (e) {
            console.log(e.statusText, e.responseText, "Call failed!");
        });
    }

    // should be able to page
    function executePagination () {
        console.log('executePagination ran!');
        // keep track of page number to ensure you do not go before 1 or after
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