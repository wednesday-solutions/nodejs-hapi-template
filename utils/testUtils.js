import { users } from '@models';
import { init } from '../lib/testServer';
import { mockData } from './mockData';
import { DEFAULT_METADATA_OPTIONS } from './constants';

export function configDB(metadataOptions = DEFAULT_METADATA_OPTIONS) {
  const SequelizeMock = require('sequelize-mock');
  const DBConnectionMock = new SequelizeMock();

  const userMock = DBConnectionMock.define('users', mockData.MOCK_USER);
  userMock.findByPk = (query) => userMock.findById(query);
  userMock.count = () => 1;

  const oauthClientsMock = DBConnectionMock.define(
    'oauthClients',
    mockData.MOCK_OAUTH_CLIENTS(metadataOptions),
  );
  oauthClientsMock.findOne = (query) => oauthClientsMock.findById(query);

  const oauthAccessTokensMock = DBConnectionMock.define(
    'oauth_access_tokens',
    mockData.MOCK_OAUTH_ACCESS_TOKENS,
  );
  oauthAccessTokensMock.create = (mutation) => new Promise((resolve) => resolve({ ...mutation }));

  const oauthClientResourcesMock = DBConnectionMock.define(
    'oauth_client_resources',
    mockData.MOCK_OAUTH_CLIENT_RESOURCES[0],
  );
  oauthClientResourcesMock.findOne = (query) => oauthClientResourcesMock.findById(query);

  oauthClientResourcesMock.findAll = (query) => oauthClientResourcesMock.findById(query);

  const oauthClientScopesMock = DBConnectionMock.define(
    'oauth_client_scopes',
    mockData.MOCK_OAUTH_CLIENT_SCOPES,
  );

  oauthClientScopesMock.findOne = (query) => oauthClientScopesMock.findById(query);

  oauthClientScopesMock.findAll = (query) => oauthClientScopesMock.findById(query);
  return {
    users: userMock,
    oauthClients: oauthClientsMock,
    oauthAccessTokens: oauthAccessTokensMock,
    oauthClientResources: oauthClientResourcesMock,
    oauthClientScopes: oauthClientScopesMock,
  };
}

export function bustDB() {
  users.sync({ force: true }); // this will clear all the entries in your table.
}

export async function mockDB(
  mockCallback = () => {},
  metadataOptions = DEFAULT_METADATA_OPTIONS,
) {
  jest.doMock('@models', () => {
    const sequelizeData = configDB(metadataOptions);
    if (mockCallback) {
      mockCallback({ models: sequelizeData });
    }
    return { models: sequelizeData };
  });
}

export const resetAndMockDB = async (
  mockDBCallback = () => {},
  metadataOptions = DEFAULT_METADATA_OPTIONS,
) => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
  mockDB(mockDBCallback, metadataOptions);
  const server = await init();
  return server;
};
