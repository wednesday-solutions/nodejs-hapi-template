import { resetAndMockDB } from '@utils/testUtils';
import { OAUTH_CLIENT_ID, SCOPE_TYPE } from '@utils/constants';
import { createMockTokenWithScope, mockData } from '@utils/mockData';

const superAdminToken = createMockTokenWithScope(
  SCOPE_TYPE.SUPER_ADMIN,
  OAUTH_CLIENT_ID
);

const payload = { pagination: true, page: 1, limit: 10 };
const auth = {
  credentials: { ...superAdminToken },
  strategy: 'bearer',
};

const { MOCK_OAUTH_CLIENT_SUPER_USER: oauthClient } = mockData;

const errorMessage = 'TEST ERROR';

describe('/oauth2/resources route tests', () => {
  let server;
  it('should get all the resources of a provided client', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClientResources.$queryInterface.$useHandler(
        (query) => {
          if (query === 'findById') {
            return oauthClient;
          }
        }
      );
    });
    const res = await server.inject({
      method: 'GET',
      url: '/oauth2/resources?limit=10&page=1',
      auth,
      payload,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.result.client_id).toEqual(auth.credentials.oauthClientId);
    expect(res.result.oauth_client_resources[0].get().resource_type).toEqual(
      OAUTH_CLIENT_ID
    );
  });

  it('should return notFound if no resources are available for a client', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClientResources.$queryInterface.$useHandler(
        (query) => {
          if (query === 'findById') {
            return null;
          }
        }
      );
    });
    const res = await server.inject({
      method: 'GET',
      url: '/oauth2/resources?limit=10&page=1',
      auth,
      payload,
    });
    expect(res.statusCode).toEqual(404);
  });

  it('should return the resources by resourceId', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClientResources.$queryInterface.$useHandler(
        (query) => {
          if (query === 'findById') {
            return oauthClient;
          }
        }
      );
    });
    const res = await server.inject({
      method: 'GET',
      url: '/oauth2/resources/1',
      auth,
      payload,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.result.id).toEqual(1);
  });

  it('should return notFound if resources are not available for the given resourceId', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClientResources.$queryInterface.$useHandler(
        (query) => {
          if (query === 'findById') {
            return null;
          }
        }
      );
    });
    const res = await server.inject({
      method: 'GET',
      url: '/oauth2/resources/1',
      auth,
      payload,
    });
    expect(res.statusCode).toEqual(404);
  });

  it('should create resources if all parameters provided are valid', async () => {
    const postPayload = {
      oauth_client_id: 1,
      resource_id: 1,
      resource_type: OAUTH_CLIENT_ID,
    };
    const res = await server.inject({
      method: 'POST',
      auth,
      url: '/oauth2/resources',
      payload: postPayload,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.result.oauthClientId).toEqual(postPayload.oauth_client_id);
    expect(res.result.resourceType).toEqual(postPayload.resource_type);
    expect(res.result.resourceId).toEqual(postPayload.resource_id);
  });

  it('should return badRequest if request creation fails', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClientResources.$queryInterface.$useHandler(
        (query) => {
          if (query === 'findById') {
            return null;
          }
        }
      );
      allDbs.models.oauthClientResources.create = () =>
        // eslint-disable-next-line no-promise-executor-return
        new Promise((resolve, reject) => reject(new Error(errorMessage)));
    });
    const postPayload = {
      oauth_client_id: 1,
      resource_id: 1,
      resource_type: OAUTH_CLIENT_ID,
    };
    const res = await server.inject({
      method: 'POST',
      auth,
      url: '/oauth2/resources',
      payload: postPayload,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.result.message).toEqual(errorMessage);
  });

  it('should update the resources if parameters are valid', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClientResources.$queryInterface.$useHandler(
        (query) => {
          if (query === 'findById') {
            return oauthClient;
          }
        }
      );
    });
    const postPayload = {
      oauth_client_id: oauthClient.id,
      resource_id: 1,
      resource_type: OAUTH_CLIENT_ID,
    };
    const res = await server.inject({
      method: 'PATCH',
      auth,
      url: '/oauth2/resources/1',
      payload: postPayload,
    });

    const resultResources = res.result.oauth_client_resources[0].get();
    expect(res.statusCode).toEqual(200);
    expect(res.result.id).toEqual(postPayload.oauth_client_id);
    expect(resultResources.resource_type).toEqual(OAUTH_CLIENT_ID);
    expect(resultResources.resource_id).toEqual(postPayload.resource_id);
  });

  it('should return badRequest if the parameters are wrong', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.oauthClientResources.$queryInterface.$useHandler(
        (query) => {
          if (query === 'findById') {
            return oauthClient;
          }
        }
      );
      allDbs.models.oauthClientResources.update = () =>
        new Promise((resolve, reject) => reject(new Error(errorMessage)));
    });
    const postPayload = {
      oauth_client_id: oauthClient.id,
      resource_id: 1,
      resource_type: OAUTH_CLIENT_ID,
    };

    const res = await server.inject({
      method: 'PATCH',
      auth,
      url: '/oauth2/resources/1',
      payload: postPayload,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.result.message).toEqual(errorMessage);
  });
});
