// As a user, I want to be able to find a place or event to visit.



// As a user, I should be able to choose between events or locations.
// As a user, I should be able to see what is available in my local area.
// As a user, I should be aware of the weather so I can dress for the occasion.
// As a user, I should be able to add what I've planned in my calendar.
// As a user, I should be able to add, edit, and delete what I added in my calendar.
// As a user, I should be able to get a summary of the event or place.
// As a user, I should be able to go to the homepage on either Eventbrite or Foursquare for the particular selection.
// As a user, I should be able to tab and select events or places with a keyboard; everything should be accessible.

function getUserLoc () {
    $.getJSON(`http://api.ipstack.com/check?access_key=${config.ipstack.key}`, function (response) {
        data.seed = response;
        main();
    });
}

var skycons = new Skycons({"monochrome": false});

var skycons = new Skycons({
"monochrome": false,
"colors" : {
    "cloud" : "#cae9ff",
    "fog" : "#8c8598",
    "fogbank" : "#8c8598",
    "leaf" : "#93bb1f",
    "moon" : "#8c8598",
    "rain" : "#74bdf3",
    "snow" : "#cae9ff",
    "sun" : "#fff17c",
    "wind" : "#5695bd"
}
});

skycons.add("icon", Skycons.CLEAR_DAY);
skycons.play();

function addToEventListOrCalendar () {
    console.log('addToEventListOrCalendar ran!');
}

function main () {
    app.eventbrite();
    app.darksky.getUserLocWeather();
    app.fourSquare();
    // app.directions();
    addToEventListOrCalendar();
}

$(getUserLoc);