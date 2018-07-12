app.darksky = {
    getUserLocWeather: function () {
        console.log('Inside darksky!');

        var loc_data = {
            latitude: data.seed.latitude,
            longitude: data.seed.longitude
        };

        $.ajax({
            url: `https://api.darksky.net/forecast/${config.darkSky.key}/${loc_data.latitude},${loc_data.longitude}`,
            dataType: "JSONP"
        }).done(function (data) {
            console.log(data);
            $('.temp').text(data.currently.temperature);
            $('.summary').text(data.currently.summary);
            $('.feels-like').text( data.currently.apparentTemperature);
        });
    },
    getLocalWeather: function () {
        console.log('getLocalWeather ran!');
    }
};