function getUserLoc () {
    $.getJSON(`http://api.ipstack.com/check?access_key=${config.ipstack.key}`, function (response) {
        storedData.seed = response;
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
    const html = `<li><span class="detail">${detail}</span><div class="detail-date"><span class="cal-date">${date}</span>, <span class="time-date">${time}</span></div><button class="update">Update</button><button class="delete">Delete</button></li>`;
    appendPlan(html);
}

function appendPlan (html) {
    $('.plan-list').append(html);
}

// function updatePlan () {
//     $('.planner-viewer').on('click', '.update', function (e) {
//         console.log($(e.currentTarget).parent(), $(e.target));
//     });
// }

function deletePlan () {
    $('.planner-viewer').on('click', '.delete', function (e) {
        e.preventDefault();
        const li = $(this).closest('li');
        li.remove();
    });
}

function togglePlanner () {
    $('.planner-view').on('click', function () {
        $('.planner-viewer').toggle();
        if ($('.planner-viewer').is(':hidden') === false) {
            $('body').css({overflow: 'hidden'});
        } else {
            $('body').css({overflow: 'auto'});
        }
    });
}

function mainPlanner () {
    addToPlanner();
    deletePlan();
    // updatePlan();
    togglePlanner();
}

function main () {
    app.eventsAPIs();
    app.darksky.getUserLocWeather();
    mainPlanner();
}


$(getUserLoc);