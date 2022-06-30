const { migrate } = require('utils/migrateUtils');

module.exports = {
    up: queryInterface => migrate(__filename, queryInterface),
    down: () => Promise.resolve('done')
};
