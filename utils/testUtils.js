import { users } from 'models';
import { init } from '../lib/testServer';
import { mockData } from './mockData';

export function configDB() {
    const SequelizeMock = require('sequelize-mock');
    const DBConnectionMock = new SequelizeMock();

    const userMock = DBConnectionMock.define('users', mockData.MOCK_USER);
    userMock.findByPk = query => userMock.findById(query);
    userMock.count = () => 1;

    const oauthClientsMock = DBConnectionMock.define(
        'oauth_clients',
        mockData.MOCK_OAUTH_CLIENTS
    );
    oauthClientsMock.findOne = query => oauthClientsMock.findById(query);

    const oauthAccessTokensMock = DBConnectionMock.define(
        'oauth_access_tokens',
        mockData.MOCK_OAUTH_ACCESS_TOKENS
    );
    oauthAccessTokensMock.create = mutation =>
        new Promise(resolve => resolve({ ...mutation }));

    const oauthClientResourcesMock = DBConnectionMock.define(
        'oauth_client_resources',
        mockData.MOCK_OAUTH_CLIENT_RESOURCES[0]
    );
    oauthClientResourcesMock.findOne = query =>
        oauthClientResourcesMock.findById(query);

    const oauthClientScopeMock = DBConnectionMock.define(
        'oauth_client_scope',
        mockData.MOCK_OAUTH_CLIENT_SCOPE
    );
    return {
        users: userMock,
        oauth_clients: oauthClientsMock,
        oauth_access_tokens: oauthAccessTokensMock,
        oauth_client_resources: oauthClientResourcesMock,
        oauth_client_scope: oauthClientScopeMock
    };
}

export function bustDB() {
    users.sync({ force: true }); // this will clear all the entries in your table.
}

export async function mockDB(mockCallback = () => {}) {
    jest.doMock('models', () => {
        const sequelizeData = configDB();
        if (mockCallback) {
            mockCallback(sequelizeData);
        }
        return sequelizeData;
    });
}

export const resetAndMockDB = async mockDBCallback => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
    mockDB(mockDBCallback);
    const server = await init();
    return server;
};
