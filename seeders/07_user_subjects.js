module.exports = {
    up: queryInterface => {
        const range = require('lodash/range');
        const arr = [];
        range(1, 3).forEach(i =>
            range(1, 4).forEach(j => {
                arr.push({
                    user_id: i,
                    subject_id: j
                });
            })
        );

        return queryInterface.bulkInsert('user_subjects', arr, {});
    },
    down: queryInterface => queryInterface.bulkDelete('user_subjects', null, {})
};
