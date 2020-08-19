import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

describe('oauthClientResources dao', () => {
    const { MOCK_OAUTH_CLIENTS: authClientsMockData } = mockData;
    const ALL_ATTRIBUTES = [
        'id',
        'oauthClientId',
        'resourceType',
        'resourceId',
        'createdAt',
        'updatedAt'
    ];
    let spy;
    const id = 1;
    const oauthClientId = authClientsMockData.clientId;
    const token = { oauthClientId };

    describe('findResourceWithOauthClientId', () => {
        it('should call findOne finder of oauthClientResources with the correct parameters', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.oauth_client_resources, 'findOne');
            });
            const {
                findResourceWithOauthClientId
            } = require('daos/oauthClientResourcesDao');
            await findResourceWithOauthClientId(id, oauthClientId);
            expect(spy).toBeCalledWith(
                expect.objectContaining({
                    attributes: ALL_ATTRIBUTES,
                    where: {
                        id,
                        oauthClientId
                    },
                    raw: true
                })
            );
        });
    });

    describe('findClientResources', () => {
        let page = 1;
        let limit = 10;
        let offset = (page - 1) * limit;

        const order = [['id', 'ASC']];
        it('should call findAll finder of oauthClientResources with the correct parameters', async () => {
            await resetAndMockDB(db => {
                spy = jest.spyOn(db.oauth_client_resources, 'findAll');
            });
            const {
                findClientResources
            } = require('daos/oauthClientResourcesDao');
            await findClientResources(token, page, limit);
            expect(spy).toBeCalledWith(
                expect.objectContaining({
                    attributes: ALL_ATTRIBUTES,
                    where: {
                        oauthClientId
                    },
                    offset,
                    limit,
                    order
                })
            );
            page = 2;
            limit = 20;
            offset = (page - 1) * limit;
            jest.clearAllMocks();
            await findClientResources(token, page, limit);
            expect(spy).toBeCalledWith(
                expect.objectContaining({
                    attributes: ALL_ATTRIBUTES,
                    where: {
                        oauthClientId
                    },
                    offset,
                    limit,
                    order
                })
            );
        });
    });
});
