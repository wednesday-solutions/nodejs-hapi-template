const { migrate } = require('./utils');

module.exports = {
  up: (queryInterface) => migrate(__filename, queryInterface),
  down: () => Promise.reject(new Error('error')),
};
