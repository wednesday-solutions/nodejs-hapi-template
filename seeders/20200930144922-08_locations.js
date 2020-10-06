'use strict';

module.exports = {
    up: queryInterface =>
        queryInterface.bulkInsert(
            'locations',
            [
                {
                    name: 'New Thippasandra',
                    latitude: -36.65831,
                    longitude: 2.51266
                },
                {
                    name: 'Indiranagar',
                    latitude: -15.04943,
                    longitude: 169.35806
                },
                {
                    name: 'Jeevan Beema Nagar',
                    latitude: 53.46752,
                    longitude: -106.3556
                },
                {
                    name: 'Katrang',
                    latitude: -12.184,
                    longitude: -106.606
                },
                {
                    name: 'Subhash Ganj',
                    latitude: 49.44957,
                    longitude: 115.70814
                }
            ],
            {}
        ),

    down: queryInterface => queryInterface.bulkDelete('locations', null, {})
};
