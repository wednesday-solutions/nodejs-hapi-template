import { resetAndMockDB } from 'utils/testUtils';
import { mockData, mockMetadata } from 'utils/mockData';
import server from 'config/server';

describe('oauthAccessTokenDao', () => {
    const { MOCK_OAUTH_CLIENTS: authClientsMockData } = mockData;
    const metaData = mockMetadata();
    describe('createAccessToken', () => {
        let spy;
        const ttl = server.app.options.oauth.access_token_ttl;
        const BEARER = 'Bearer';

        it.only('should call findOne in the oauthClients model and find the client by the ID', async () => {
            await resetAndMockDB(db => {
                db.oauth_access_tokens.create = async value => ({
                    get: () => value
                });
                spy = jest.spyOn(db.oauth_access_tokens, 'create');
            });
            const { createAccessToken } = require('daos/oauthAccessTokensDao');
            await createAccessToken(authClientsMockData.id, ttl);

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    accessToken: expect.any(String),
                    oauthClientId: authClientsMockData.id,
                    expiresIn: ttl,
                    expiresOn: expect.any(String),
                    tokenType: BEARER,
                    metadata: JSON.stringify({
                        scope: metaData.oauth_client_scope.get(),
                        resources: metaData.oauth_client_resources.map(
                            resource => resource.get()
                        )
                    })
                })
            );
        });
        it('should call the findOne finder of oauth_clients with the provided ID ', async () => {
            await resetAndMockDB(db => {
                db.oauth_access_tokens.create = async value => ({
                    get: () => value
                });
                spy = jest.spyOn(db.oauth_clients, 'findOne');
            });
            const { createAccessToken } = require('daos/oauthAccessTokensDao');
            await createAccessToken(authClientsMockData.id, ttl);
            expect(spy).toBeCalledWith({
                where: { id: authClientsMockData.id },
                include: expect.anything()
            });
        });
        it('should call the findOne finder of oauth_clients with the provided ID ', async () => {
            await resetAndMockDB(db => {
                db.oauth_access_tokens.create = async value => ({
                    get: () => value
                });
                spy = jest.spyOn(db.oauth_clients, 'findOne');
            });
            const { createAccessToken } = require('daos/oauthAccessTokensDao');
            await createAccessToken(authClientsMockData.id, ttl);
            expect(spy).toBeCalledWith({
                where: { id: 90000 },
                include: expect.anything()
            });
        });
    });
});
