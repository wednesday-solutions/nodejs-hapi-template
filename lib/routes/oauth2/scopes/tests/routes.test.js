import { resetAndMockDB } from '@utils/testUtils';
import { OAUTH_CLIENT_ID, SCOPE_TYPE } from '@utils/constants';
import { createMockTokenWithScope, mockData } from '@utils/mockData';

const superAdminToken = createMockTokenWithScope(
  SCOPE_TYPE.SUPER_ADMIN,
  OAUTH_CLIENT_ID
);

const payload = { pagination: true, page: 1, limit: 10 };
const updatePayload = { scope: SCOPE_TYPE.USER, oauth_client_id: 1 };
const superAdminAuth = {
  credentials: { ...superAdminToken },
  strategy: 'bearer',
};
const errorMessage = `Unable top update scope: ${updatePayload.scope} for oauthClient: ${updatePayload.oauth_client_id}`;
const { MOCK_OAUTH_CLIENT_SUPER_USER: oauthClient } = mockData;

const getScopeFromResponse = (response) =>
  response.result.oauth_client_scope.get();

describe('/oauth2/scopes route tests', () => {
  let server;
  it('should return the scope correctly', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClientScopes.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return oauthClient;
        }
      });
    });
    const res = await server.inject({
      method: 'GET',
      url: '/oauth2/scopes',
      auth: superAdminAuth,
      payload,
    });
    expect(res.statusCode).toEqual(200);
    expect(getScopeFromResponse(res).scope).toEqual(SCOPE_TYPE.SUPER_ADMIN);
  });

  it('should return the notFound if scope was not found for the client', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClientScopes.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return null;
        }
      });
    });
    const res = await server.inject({
      method: 'GET',
      url: '/oauth2/scopes',
      auth: superAdminAuth,
      payload,
    });
    expect(res.statusCode).toEqual(404);
  });

  it('should return the scope by scope Id', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClientScopes.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return oauthClient;
        }
      });
    });
    const res = await server.inject({
      method: 'GET',
      url: '/oauth2/scopes/1',
      auth: superAdminAuth,
      payload,
    });
    expect(res.statusCode).toEqual(200);
    expect(getScopeFromResponse(res).id).toEqual(1);
  });

  it('should return notFound if a scope of the given Id was not found', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClientScopes.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return null;
        }
      });
    });
    const res = await server.inject({
      method: 'GET',
      url: '/oauth2/scopes/1',
      auth: superAdminAuth,
      payload,
    });
    expect(res.statusCode).toEqual(404);
  });

  it('should update the scope of client', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClientScopes.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return oauthClient;
        }
      });
      allDbs.models.oauthClientScopes.update = () =>
        new Promise((resolve) => resolve(oauthClient));
    });
    const res = await server.inject({
      method: 'PATCH',
      url: '/oauth2/scopes',
      auth: superAdminAuth,
      payload: updatePayload,
    });

    expect(res.statusCode).toEqual(200);
    expect(getScopeFromResponse(res).id).toEqual(1);
  });

  it('should return badRequest if a scope of the given Id was not found', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClientScopes.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return null;
        }
      });
      allDbs.models.oauthClientScopes.update = () =>
        new Promise((resolve, reject) => reject(new Error(errorMessage)));
    });
    const res = await server.inject({
      method: 'PATCH',
      url: '/oauth2/scopes',
      auth: superAdminAuth,
      payload: updatePayload,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.result.message).toEqual(errorMessage);
  });
});
