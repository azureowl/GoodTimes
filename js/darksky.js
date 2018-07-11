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
        });
    },
    getLocalWeather: function () {
        console.log('getLocalWeather ran!');
    }
};