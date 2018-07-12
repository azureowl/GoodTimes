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
            console.log('feels like:', data.currently.apparentTemperature, 'Temp is: ', data.currently.temperature, 'Outside is: ', data.currently.summary);
        });
    },
    getLocalWeather: function () {
        console.log('getLocalWeather ran!');
    }
};