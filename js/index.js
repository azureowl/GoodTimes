'use strict';

function addToPlanner() {
    $('.planner').submit(function (e) {
        e.preventDefault();
        createPlan();
    });
}

function createPlan() {
    const id = getRandomId();
    const detail = $("#todo").val();
    const date = $("#planner-date").val();
    const time = $("#time").val();
    const newTime = timeWithMeridiem(time);
    const html = `<li id="${id}"><span class="detail">${detail}</span><div class="detail-date"><span class="cal-date">${date}</span>, <span class="time-date">${newTime}</span></div><button class="delete">Delete</button></li>`;
    saveListItemToStorage(id, html);
    appendPlan(html);
}

function appendPlan(html) {
    $('.plan-list').append(html);
    toggleList();
}

function deletePlan() {
    $('.planner-viewer').on('click', '.delete', function (e) {
        e.preventDefault();
        const li = $(this).closest('li');
        const identifier = li.attr('id');
        li.remove();
        deleteListItemFromStorage(identifier);
        toggleList();
    });
}

function getRandomId() {
    var alph = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var number = '012345678910';
    var ln = 3;
    var id = '';

    for (let i = 0; i <= ln; i++) {
        id += alph.charAt(Math.floor(Math.random() * alph.length));
        id += number.charAt(Math.floor(Math.random() * number.length));
    }

    return id;
}

// If local Storage exists, use the content to populate on page load
function hasLocalStorage() {
    if (window.localStorage.length > 0) {
        const localStorageObj = window.localStorage;
        const html = Object.keys(localStorageObj).map(key => {
            if (key.split('-')[0] === 'goodtimes') {
                return localStorageObj[key];
            }
        });
        $('.plan-list').append(html.join(''));
    }
}

function saveListItemToStorage(id, html) {
    id = `goodtimes-${id}`;
    localStorage.setItem(id, html);
}

function deleteListItemFromStorage(id) {
    localStorage.removeItem(`goodtimes-${id}`);
}

function timeWithMeridiem(time) {
    const hour = Number(time.split(':')[0]);
    if (hour >= 12 && hour <= 23) {
        return `${time} PM`;
    } else if (hour >= 0 && hour <= 11) {
        if (hour === 0) {
            return `12:${time.split(':')[1]} AM`;
        } else {
            return `${time} AM`;
        }
    }
}

function toggleList() {
    var childLength = $('.planner-viewer').find('.plan-list').children().length;
    if (childLength > 0) {
        $('.planner-viewer').show();
    } else {
        $('.planner-viewer').hide();
    }
}

$('.js-start-search').on('click', function (e) {
    if ($("main").is(':hidden')) {
        $("main").show();
        $('.js-landing-page').hide();
    }
});

function mainPlanner() {
    hasLocalStorage();
    addToPlanner();
    deletePlan();
    toggleList();
}

function main() {
    app.eventsAPIs();
    mainPlanner();
}

$(main);