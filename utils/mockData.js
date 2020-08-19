import { GRANT_TYPE, SCOPE_TYPE } from './constants';
const SequelizeMock = require('sequelize-mock');

const DBConnectionMock = new SequelizeMock();

const oauthClientResourcesMock = DBConnectionMock.define(
    'oauth_client_resources',
    {
        id: 1,
        oauth_client_id: 1,
        resource_type: 1,
        resource_id: 1
    }
);
const oauthClientScopeMock = DBConnectionMock.define('oauth_client_scope', {
    id: 1,
    oauth_client_id: 1,
    scope: SCOPE_TYPE.USER
});
export const mockData = {
    MOCK_USER: {
        id: 1,
        firstName: 'Sharan',
        lastName: 'Salian',
        email: 'sharan@wednesday.is'
    },
    MOCK_OAUTH_CLIENTS: {
        id: 1,
        clientId: 'TEST_CLIENT_ID_1',
        clientSecret: 'TEST_CLIENT_SECRET',
        grantType: GRANT_TYPE.CLIENT_CREDENTIALS
    }
};
