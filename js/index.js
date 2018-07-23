'use strict';

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
    const newTime = timeWithMeridiem(time);
    const html = `<li><span class="detail">${detail}</span><div class="detail-date"><span class="cal-date">${date}</span>, <span class="time-date">${newTime}</span></div><button class="delete">Delete</button></li>`;

    appendPlan(html);
}

function appendPlan (html) {
    $('.plan-list').append(html);
}

function deletePlan () {
    $('.planner-viewer').on('click', '.delete', function (e) {
        e.preventDefault();
        const li = $(this).closest('li');
        li.remove();
    });
}

function timeWithMeridiem (time) {
    const hour = Number(time.split(':')[0]);
    if (hour >= 12 && hour <= 23) {
        return `${time} PM`;
    } else if (hour >= 0 && hour <= 11) {
        if (hour === 0) {
            return `12:${time.split(':')[1]} AM`
        } else {
            return `${time} AM`;
        }
    }
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
    togglePlanner();
}

function main () {
    // app.eventsAPIs();
    app.darksky.getUserLocWeather();
    mainPlanner();
}

$(main);