app.fourSquare = function () {
    const endpoints = {
        explore: 'https://api.foursquare.com/v2/venues/explore',
        venues: 'https://api.foursquare.com/v2/venues/'
    };

    let currentVenuesReturned = [];

    const getCredentials = () => {
        return {
            id: config.fourSquare.idTemp2,
            secret: config.fourSquare.secretTemp2
        }
    };

    // should take queries from a form

    // Seed with Recommended places data based on user location
    function seedFoursquarePlaces () {
        const query = {
            near: data.seed.city,
            client_id: getCredentials().id,
            client_secret: getCredentials().secret,
            limit: 1,
            v: '20180323'
        };
        makeAJAXCall(query);
    }

    // should get list of searched venues
    function searchVenues () {
        currentVenuesReturned = [];
        const query = {
            ll: '37.4852,-122.2364',
            query: 'mexican food',
            limit: 1,
            client_id: getCredentials().id,
            client_secret: getCredentials().secret,
            v: '20180323'
        };
        makeAJAXCall(query);
    };

    function makeAJAXCall (query) {
        $.getJSON(endpoints.explore, query, function (response) {
            const venues = response.response.groups[0].items;
            generatePlacesMarkup(venues);
        });
    }

    // Generate Foursquare with places information
    function generatePlacesMarkup(venues) {
        console.log(venues);
        const results = venues.forEach(function (place, i) {
            const placeholder = "../images/no-image-available.jpg";
            const venueName = place.venue.name ? place.venue.name : "No Title";
            const venueLoc = `${place.venue.location.city}, ${place.venue.location.country}`;
            const venueAdd = `${place.venue.location.address}, ${place.venue.location.city}`;
            const html = `<div class="venue-info"><p class="result-title">${venueName}</p><p class="result-add">${venueAdd}</p></div></div></div>`;
            getVenueDetails(place.venue.id, html);
        });
    }

    function getVenueDetails (venueID, html) {
        const query = {
            client_id: getCredentials().id,
            client_secret: getCredentials().secret,
            limit: 1,
            v: '20180323'
        };

        $.getJSON(`${endpoints.venues}/${venueID}/photos`, query, function (photoData) {
            const image = `${photoData.response.photos.items[0].prefix}width600${photoData.response.photos.items[0].suffix}`;
            const joinedHTML = `<div class="col col-4 results-margin"><div class="results-cell"><button class="results-btn-image"><img src="${image}" alt=""></button>${html}`;
            appendFoursquarePlaces(joinedHTML);
        });
    }

    function appendFoursquarePlaces (html) {
        $('.js-foursq-results').append(html);
    }

    // people who liked this venue

    function getVenueLikes (venueID) {
        //endpoint https://api.foursquare.com/v2/venues/VENUE_ID/likes
        // id value to test: 521aea6c11d2ad79adc354ff
        console.log('getVenueLikes ran!');
    }

    // should get similar venues
    function getSimilarVenues () {
        // endpoint https://api.foursquare.com/v2/venues/VENUE_ID/similar
        // id value to test: 521aea6c11d2ad79adc354ff
        console.log('getSimilarVenues ran!');
    }
    
    // should get recommended list of venues
    function getRecommendedVenues () {
        console.log('getRecommendedVenues ran!');
    }

    
    function main () {
        // searchVenues();
        // getVenueLikes();
        // getSimilarVenues();
        seedFoursquarePlaces();
        console.log('main is now running!');
    }

    $(main);

};
