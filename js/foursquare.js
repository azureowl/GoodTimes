app.fourSquare = function () {
    const endpoints = {
        search: 'https://api.foursquare.com/v2/venues/search',
        venues: 'https://api.foursquare.com/v2/venues/'
    };

    let currentVenuesReturned = [];
    const userSeedData = {};

    const getCredentials = () => {
        console.log('getCredentials ran!');
        return {
            id: config.fourSquare.idTemp2,
            secret: config.fourSquare.secretTemp2
        }
    };

    // should take queries from a form

    // Generate Foursquare with places information
    function generatePlacesMarkup(response) {
        console.log('generatePlacesMarkup ran!');
        const places = response.response.groups[0].items;
        console.log(places);
        const results = places.forEach(function (place, i) {
            const placeholder = "../images/no-image-available.jpg";
            const venueName = place.venue.name ? place.venue.name : "No Title";
            const venueLoc = `${place.venue.location.city}, ${place.venue.location.country}`;
            console.log(place, place.venue.id);
            // get venue details
            getVenueDetails(place.venue.id, venueName);
        });
    }

    function appendFoursquarePlaces (html) {
        $('.js-foursq-results').append(html);
        console.log('appendFoursquarePlaces ran!');
    }

    // Seed with Recommended places data based on user location
    function seedFoursquarePlaces () {
        const query = {
            near: 'Redwood City, Ca',
            client_id: getCredentials().id,
            client_secret: getCredentials().secret,
            limit: 2,
            v: '20180323'
        };

        $.getJSON('https://api.foursquare.com/v2/venues/explore', query, function (response) {
            console.log(response);
            generatePlacesMarkup(response);
        });
    }

    // should get list of searched venues
    function searchVenues () {
        currentVenuesReturned = [];
        const query = {
            ll: '37.4852,-122.2364',
            query: 'mexican food',
            client_id: getCredentials().id,
            client_secret: getCredentials().secret,
            v: '20180323'
        };

        $.getJSON(endpoints.search, query, function (data) {
            const venues = data.response.venues;
            // just in case, I stored returned values in an array
            currentVenuesReturned.push(venues);
            console.log(venues, data);
        });

        console.log('searchVenues ran!');
    };

    // should get details about a venue such as photos, hours, menu if applicable
    // from clicking on list returned
    function getVenueDetails (venueID, venueName) {
        // endpoint https://api.foursquare.com/v2/venues/VENUE_ID
        // id value to test: 521aea6c11d2ad79adc354ff
        const query = {
            client_id: getCredentials().id,
            client_secret: getCredentials().secret,
            limit: 2,
            v: '20180323'
        };

        console.log(venueID);

        $.getJSON(`${endpoints.venues}/${venueID}/photos`, query, function (photoData) {
            const photo = `${photoData.response.photos.items[0].prefix}width600${photoData.response.photos.items[0].suffix}`;
            console.log(photo);
            const html = `<div class="col col-4 results-margin"><div class="results-cell"><button class="results-btn-image"><img src="${photo}" alt=""></button><p class="result-title">${venueName}</p></div></div>`;
            appendFoursquarePlaces(html);
        });
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
        getVenueLikes();
        getSimilarVenues();
        // seedFoursquarePlaces();
        console.log('main is now running!');
    }

    $(main);

};
