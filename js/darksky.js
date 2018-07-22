app.darksky = {
    getUserLocWeather: function () {
        var loc_data = {
            latitude: storedData.seed.latitude,
            longitude: storedData.seed.longitude
        };

        $.ajax({
            url: `https://api.darksky.net/forecast/${config.darkSky.key}/${loc_data.latitude},${loc_data.longitude}`,
            dataType: "JSONP"
        }).done(function (data) {
            $('.js-temp').text(Math.floor(data.currently.temperature));
            $('.js-summary').text(data.currently.summary);
            $('.js-feels-like').text(Math.floor(data.currently.apparentTemperature));
            $('.js-precip').text(data.currently.precipProbability);
            app.darksky.depictWeather(data.currently.icon);
        });
    },
    getLocalWeather: function (latitude, longitude) {
        $.ajax({
            url: `https://api.darksky.net/forecast/${config.darkSky.key}/${latitude},${longitude}`,
            dataType: "JSONP"
        }).done(function (data) {
            $('.js-temp').text(Math.floor(data.currently.temperature));
            $('.js-summary').text(data.currently.summary);
            $('.js-feels-like').text(Math.floor(data.currently.apparentTemperature));
            $('.js-precip').text(data.currently.precipProbability);
            app.darksky.depictWeather(data.currently.icon);
        });
    },
    depictWeather: function (icon) {
        var skycons = new Skycons({"monochrome": false});
        skycons.add("js-weather-icon", icon);
        skycons.play();
    }
};
