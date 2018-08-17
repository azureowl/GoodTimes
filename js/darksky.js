app.darksky = {
    makeRequest: function (latitude, longitude) {
        const promise = $.ajax({
            url: `https://api.darksky.net/forecast/${config.darkSky.key}/${latitude},${longitude}`,
            dataType: "JSONP"
        });

        this.getWeatherResponse(promise);
    },
    depictWeather: function (icon) {
        var skycons = new Skycons({
            "monochrome": false
        });
        skycons.add("js-weather-icon", icon);
        skycons.play();
    },
    getWeatherResponse: function (promise) {
        promise.done(function (data) {
            $('.js-temp').text(Math.floor(data.currently.temperature));
            $('.js-summary').text(data.currently.summary);
            $('.js-feels-like').text(Math.floor(data.currently.apparentTemperature));
            $('.js-precip').text(data.currently.precipProbability);
            app.darksky.depictWeather(data.currently.icon);
        });

        promise.fail(function () {
            $('.weather-container').html('Something is wrong. Unable to get weather information.');
        });
    }
};