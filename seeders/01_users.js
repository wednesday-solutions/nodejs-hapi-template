module.exports = {
    up: queryInterface => {
        const arr = [
            {
                id: 1,
                first_name: 'Sharan',
                last_name: 'Salian',
                email: 'ss@kun.ai'
            },
            {
                id: 2,
                first_name: 'mac',
                last_name: 'mac',
                email: '@kun.ai'
            }
        ];
        return queryInterface.bulkInsert('users', arr, {});
    },
    down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
