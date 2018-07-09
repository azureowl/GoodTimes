app.darksky = function () {
    console.log('Inside darksky!');
    var test ={
    latitude: 37.8267,
    longitude: -122.4233};

    $.ajax({
        url: `https://api.darksky.net/forecast/${config.darkSky.key}/${test.latitude},${test.longitude}`,
        dataType: "JSONP"
    }).done(function (data) {
        console.log(data);
    });

};