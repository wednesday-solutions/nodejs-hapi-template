'use strict';

module.exports = {
    up: queryInterface =>
        queryInterface.bulkInsert(
            'cabs',
            [
                {
                    number: 'UP93 1423',
                    driver_id: 1
                },
                {
                    number: 'UP93 8976',
                    driver_id: 2
                },
                {
                    number: 'UP93 7023',
                    driver_id: 3
                },
                {
                    number: 'UP93 4034',
                    driver_id: 4
                },
                {
                    number: 'UP93 0743',
                    driver_id: 5
                }
            ],
            {}
        ),

    down: queryInterface => queryInterface.bulkDelete('cabs', null, {})
};
