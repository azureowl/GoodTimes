function getUserLoc () {
    $.getJSON(`http://api.ipstack.com/check?access_key=${config.ipstack.key}`, function (response) {
        data.seed = response;
        console.log(response);
        $('.user-loc').html(`${response.city}, ${response.country_code}`);
        main();
    });
}

// planner should be able to add thing to do
function addToPlanner () {
    $('.planner').submit(function (e) {
        e.preventDefault();
        createPlan();
    });
}

function createPlan () {
    const detail = $("#todo").val();
    const date = $("#planner-date").val();
    const time = $("#time").val();
    const html = `<li><span class="detail">${detail}</span><div class="detail-date"><span class="cal-date">${date}</span>, <span class="time-date">${time}</span></div><button class="delete">Delete</button></li>`;
    appendPlan(html);
}

function appendPlan (html) {
    $('.plan-list').append(html);
}

function deletePlan () {
    console.log('deletePlan ran!');
    $('body').on('click', '.delete', function (e) {
        e.preventDefault();
        const li = $(this).closest('li');
        li.remove();
    });
}

function togglePlannerViewer () {
    $('.planner-view').on('click', function () {
        if ($('.planner-viewer').attr('hidden') === 'hidden') {
            $('.planner-viewer').removeAttr('hidden');
        } else {
            $('.planner-viewer').attr('hidden', 'true');
        }
    });
}

function mainPlanner () {
    addToPlanner();
    deletePlan();
    togglePlannerViewer();
    console.log('mainPlanner ran!');
}


// // Testing
// var skycons = new Skycons({"monochrome": false});

// var skycons = new Skycons({
// "monochrome": false,
// "colors" : {
//     "cloud" : "#cae9ff",
//     "fog" : "#8c8598",
//     "fogbank" : "#8c8598",
//     "leaf" : "#93bb1f",
//     "moon" : "#8c8598",
//     "rain" : "#74bdf3",
//     "snow" : "#cae9ff",
//     "sun" : "#fff17c",
//     "wind" : "#5695bd"
// }
// });

// skycons.add("icon", Skycons.CLEAR_DAY);
// skycons.play();

function addToEventListOrCalendar () {
    console.log('addToEventListOrCalendar ran!');
}

function main () {
    app.eventbrite();
    app.darksky.getUserLocWeather();
    app.fourSquare();
    addToEventListOrCalendar();
    mainPlanner();
}

$(getUserLoc);