app.fourSquare = function () {
    const endpoints = {
        search: 'https://api.foursquare.com/v2/venues/search',
        venues: 'https://api.foursquare.com/v2/venues/'
    };

    let currentVenuesReturned = [];

    const getCredentials = () => {
        console.log('getCredentials ran!');
        return {
            id: config.fourSquare.id,
            secret: config.fourSquare.secret
        }
    };

    // should take queries from a form

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
    function getVenueDetails (venueID) {
        // endpoint https://api.foursquare.com/v2/venues/VENUE_ID
        // id value to test: 521aea6c11d2ad79adc354ff
        console.log('getVenueDetails ran!')
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
        searchVenues();
        getVenueDetails();
        getVenueLikes();
        getSimilarVenues();
        console.log('main is now running!');
    }

    $(main);

};
