app.ipstack = function () {
    console.log('ipstack ran!');

    this.ipstack.getLoc = function () {
        const requesterOrigin = {};
        return $.getJSON(`http://api.ipstack.com/check?access_key=${config.ipstack.key}`, function (response) {
            return {
                city: response.city,
                region_name: response.region_name,
                country_name: response.country_name,
                latitude: response.latitude,
                longtiude: response.longitude
            }
        });
    }

    return this.ipstack;
};