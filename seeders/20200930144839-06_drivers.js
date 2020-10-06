'use strict';

module.exports = {
    up: queryInterface =>
        queryInterface.bulkInsert(
            'drivers',
            [
                {
                    first_name: 'Ajay',
                    last_name: 'Mishra',
                    phone: '9999999996',
                    license_no: '80843'
                },
                {
                    first_name: 'Raju',
                    last_name: 'Gupta',
                    phone: '9999999997',
                    license_no: '80844'
                },
                {
                    first_name: 'Sanjay',
                    last_name: 'Sharma',
                    phone: '9999999998',
                    license_no: '80845'
                },
                {
                    first_name: 'Vijay',
                    last_name: 'Verma',
                    phone: '9999999999',
                    license_no: '80846'
                },
                {
                    first_name: 'Kapil',
                    last_name: 'Singh',
                    phone: '9999999990',
                    license_no: '80847'
                }
            ],
            {}
        ),

    down: queryInterface => queryInterface.bulkDelete('drivers', null, {})
};
