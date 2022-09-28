const range = require('lodash/range');
const { OAUTH_CLIENT_ID } = require('esm')(module /* , options */)(
  '../utils/constants',
);

module.exports = {
  up: (queryInterface) => {
    const arr = range(1, 3).map((value) => ({
      oauth_client_id: 3,
      resource_type: OAUTH_CLIENT_ID,
      resource_id: value,
    }));
    return queryInterface.bulkInsert('oauth_client_resources', arr, {});
  },
  down: (queryInterface) => queryInterface.bulkDelete('oauth_client_resources', null, {}),
};
