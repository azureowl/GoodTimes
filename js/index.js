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

function toggleLightbox () {
    $('body').on('click', '.results-cell', function (e) {
        $('.lightbox').toggle();
        if ($('.lightbox').is(':hidden') === false) {
            $('body').css({overflow: 'hidden'});
            const target = $(e.target).closest('.results-cell');
            const copyObj = {
                title: target.find('.result-title').text(),
                add: target.find('.result-add').text(),
                src: $(e.target).attr('src'),
                url: target.find('.venue-info').data().url
            };
            generateLightboxMarkup(copyObj);
        } else {
            $('body').css({overflow: 'auto'});
        }
    });
}

function generateLightboxMarkup (obj) {
    const html = `<div class="col col-8"><img src="${obj.src}" alt="${obj.title}"></div><div class="col col-12 venue-info"><p class="result-title">${obj.title}</p><p class="result-add">${obj.add}</p><button class="closeLightbox results-cell">Go Back</button><a href="${obj.url}" target="_blank">Visit Page</a></div>`;
    appendToLightbox(html);
}

function appendToLightbox (html) {
    $('.lightbox').html(html);
}

function mainPlanner () {
    addToPlanner();
    deletePlan();
    // updatePlan();
    togglePlanner();
    toggleLightbox();
}

function main () {
    app.eventsAPIs();
    app.darksky.getUserLocWeather();
    mainPlanner();
}

$(main);
// $(getUserLoc);