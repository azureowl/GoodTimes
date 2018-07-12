function getUserLoc () {
    $.getJSON(`http://api.ipstack.com/check?access_key=${config.ipstack.key}`, function (response) {
        data.seed = response;
        main();
    });
}


// Testing
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