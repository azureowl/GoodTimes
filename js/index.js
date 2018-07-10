function addToEventListOrCalendar () {
    console.log('addToEventListOrCalendar ran!');
}

function main () {
    app.eventbrite();
    app.fourSquare();
    app.darksky();
    // app.directions();
    addToEventListOrCalendar();
}

$(main);