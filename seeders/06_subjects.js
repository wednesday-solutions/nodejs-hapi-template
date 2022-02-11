module.exports = {
    up: queryInterface => {
        const arr = ['MATHS', 'HISTORY', 'ENGLISH'].map(value => ({
            name: value
        }));
        return queryInterface.bulkInsert('subjects', arr, {});
    },
    down: queryInterface => queryInterface.bulkDelete('subjects', null, {})
};
