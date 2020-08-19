import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

describe('oauthAccessTokenDao', () => {
    const { MOCK_OAUTH_CLIENTS: authClientsMockData } = mockData;
    describe('createAccessToken', () => {
        let spy;
        it.only('should call findOne in the oauthClients model and find the client by the ID', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.oauth_clients, 'findOne');
                db.oauth_access_tokens.create = async value => ({
                    get: () => value
                });
            });
            const { createAccessToken } = require('daos/oauthAccessTokensDao');
            await createAccessToken(authClientsMockData.id, 100);
            expect(spy).toBeCalled();
        });
    });
});
