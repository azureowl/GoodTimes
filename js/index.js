// As a user, I want to be able to find a place or event to visit.



// As a user, I should be able to choose between events or locations.
// As a user, I should be able to see what is available in my local area.
// As a user, I should be aware of the weather so I can dress for the occasion.
// As a user, I should be able to add what I've planned in my calendar.
// As a user, I should be able to add, edit, and delete what I added in my calendar.
// As a user, I should be able to get a summary of the event or place.
// As a user, I should be able to go to the homepage on either Eventbrite or Foursquare for the particular selection.
// As a user, I should be able to tab and select events or places with a keyboard; everything should be accessible.

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