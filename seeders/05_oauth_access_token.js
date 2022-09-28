const moment = require('moment');
const range = require('lodash/range');
const { SCOPE_TYPE, OAUTH_CLIENT_ID } = require('esm')(module /* , options */)(
  '../utils/constants'
);
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: (queryInterface) => {
    const arr = range(1, 3).map((value) => ({
      oauth_client_id: value,
      access_token: uuidv4().replace(/-/g, ''),
      expires_in: 86400,
      metadata: JSON.stringify({
        scope: {
          id: value,
          oauthClientId: value,
          scope: value === 1 ? SCOPE_TYPE.USER : SCOPE_TYPE.ADMIN,
        },
        resources:
          value === 1
            ? []
            : [
                {
                  id: value,
                  oauthClientId: value,
                  resource_type: OAUTH_CLIENT_ID,
                  resource_id: value,
                },
              ],
      }),
      expires_on: moment().format('YYYY-MM-DD HH:mm:ss'),
      created_at: new Date(),
    }));
    return queryInterface.bulkInsert('oauth_access_tokens', arr, {});
  },
  down: (queryInterface) =>
    queryInterface.bulkDelete('oauth_access_tokens', null, {}),
};
