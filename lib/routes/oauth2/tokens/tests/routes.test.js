import { resetAndMockDB } from 'utils/testUtils';
import { mockData, createMockTokenWithScope } from 'utils/mockData';
import { SCOPE_TYPE, OAUTH_CLIENT_ID } from 'utils/constants';

const { MOCK_OAUTH_CLIENT_SUPER_USER: oauthClient } = mockData;

const superAdminToken = createMockTokenWithScope(
    SCOPE_TYPE.SUPER_ADMIN,
    OAUTH_CLIENT_ID
);

const superAdminAuth = {
    credentials: { ...superAdminToken },
    strategy: 'bearer'
};

const payload = {
    grant_type: 'CLIENT_CREDENTIALS',
    client_id: 'TEST_CLIENT_ID_1',
    client_secret: 'TEST_CLIENT_SECRET'
};

const errorMessage = 'Error while creating access token';

describe('/oauth2/tokens/ route tests', () => {
    let server;
    it('should create a new token for the after validating the parameters', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.oauth_clients.$queryInterface.$useHandler(function(query) {
                if (query === 'findById') {
                    return oauthClient;
                }
            });
            allDbs.oauth_access_tokens.create = () =>
                new Promise((resolve, reject) =>
                    resolve({
                        get: () => ({
                            accessToken: 'token'
                        })
                    })
                );
        });
        const res = await server.inject({
            method: 'POST',
            url: '/oauth2/tokens',
            auth: superAdminAuth,
            payload
        });
        expect(res.statusCode).toEqual(200);
        expect(res.result.access_token).toEqual('token');
    });

    it('should return unauthorized if oauthClient is not found', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.oauth_clients.$queryInterface.$useHandler(function(query) {
                if (query === 'findById') {
                    return null;
                }
            });
            allDbs.oauth_access_tokens.create = () =>
                new Promise((resolve, reject) => resolve());
        });
        const res = await server.inject({
            method: 'POST',
            url: '/oauth2/tokens',
            auth: superAdminAuth,
            payload
        });
        expect(res.statusCode).toEqual(401);
    });

    it('should return badImplementation if access token creation fails', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.oauth_clients.$queryInterface.$useHandler(function(query) {
                if (query === 'findById') {
                    return oauthClient;
                }
            });
            allDbs.oauth_access_tokens.create = () =>
                new Promise((resolve, reject) =>
                    reject(new Error(errorMessage))
                );
        });
        const res = await server.inject({
            method: 'POST',
            url: '/oauth2/tokens',
            auth: superAdminAuth,
            payload
        });
        expect(res.statusCode).toEqual(500);
    });
});
