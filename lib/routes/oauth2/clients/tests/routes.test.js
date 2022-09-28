import { mockData } from '@utils/mockData';
import { resetAndMockDB } from '@utils/testUtils';
import { SCOPE_TYPE, OAUTH_CLIENT_ID } from '@utils/constants';

const { MOCK_OAUTH_CLIENT_SUPER_USER: superClient } = mockData;

const payload = {
  scope: SCOPE_TYPE.SUPER_ADMIN,
  resources: [
    {
      resource_type: OAUTH_CLIENT_ID,
      resource_id: '1',
    },
  ],
  client_id: superClient.clientId,
  client_secret: superClient.clientSecret,
  grant_type: superClient.grantType,
};

const { MOCK_OAUTH_CLIENT_SUPER_USER: oauthClient } = mockData;

const errorMessage = 'TEST ERROR';

describe('/oauth2/clients route tests', () => {
  let server;
  it('should create a client with the provided credientials and resources', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClients.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return oauthClient;
        }
      });
      allDbs.models.oauthClients.create = () =>
        new Promise((resolve) =>
          // eslint-disable-next-line no-promise-executor-return
          resolve({
            get: () => oauthClient,
          })
        );
    });
    const res = await server.inject({
      method: 'POST',
      url: '/oauth2/clients',
      payload,
    });
    expect(res.statusCode).toEqual(200);
    const { result } = res;
    expect(result.oauth_client.client_id).toEqual(payload.client_id);
    expect(result.oauth_client.grant_type).toEqual(payload.grant_type);
    expect(result.resources[0].resource_id).toEqual(
      payload.resources[0].resource_id
    );

    expect(result.resources[0].resource_type).toEqual(
      payload.resources[0].resource_type
    );
  });

  it('should validate the parameters correctly', async () => {
    const failTestPayload = { ...payload };
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClients.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return oauthClient;
        }
      });
      allDbs.models.oauthClients.create = () =>
        new Promise((resolve) =>
          resolve({
            get: () => null,
          })
        );
    });
    failTestPayload.scope = 1;
    const res = await server.inject({
      method: 'POST',
      url: '/oauth2/clients',
      payload: failTestPayload,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.result.error).toEqual('Bad Request');
  });

  it('should validate the parameters correctly', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClients.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return oauthClient;
        }
      });
      allDbs.models.oauthClients.create = () =>
        new Promise((resolve, reject) => reject(new Error(errorMessage)));
    });
    const res = await server.inject({
      method: 'POST',
      url: '/oauth2/clients',
      payload,
    });
    expect(res.statusCode).toEqual(422);
    expect(res.result.message).toEqual(
      `Erorr while creating entity: ${errorMessage}`
    );
  });
});
