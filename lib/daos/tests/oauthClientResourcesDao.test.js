import { resetAndMockDB } from '@utils/testUtils';
import { mockData, createMockTokenWithScope } from '@utils/mockData';
import { SCOPE_TYPE } from '@utils/constants';

describe('oauthClientResources dao', () => {
  const { MOCK_OAUTH_CLIENTS: authClientsMockData } = mockData;
  const ALL_ATTRIBUTES = [
    'id',
    'oauthClientId',
    'resourceType',
    'resourceId',
    'createdAt',
    'updatedAt',
  ];
  let spy;
  const id = 1;
  const oauthClientId = authClientsMockData().clientId;
  const token = { oauthClientId };
  const superAdminToken = createMockTokenWithScope(SCOPE_TYPE.SUPER_ADMIN);
  const userToken = createMockTokenWithScope(SCOPE_TYPE.USER);
  const resource = mockData.MOCK_OAUTH_CLIENT_RESOURCES[0];

  describe('findResourceWithOauthClientId', () => {
    it('should call findOne finder of oauthClientResources with the correct parameters', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClientResources, 'findOne');
      });
      const {
        findResourceWithOauthClientId,
      } = require('@daos/oauthClientResourcesDao');
      await findResourceWithOauthClientId(id, oauthClientId);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          attributes: ALL_ATTRIBUTES,
          where: {
            id,
            oauthClientId,
          },
          raw: true,
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
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClientResources, 'findAll');
      });
      const { findClientResources } = require('@daos/oauthClientResourcesDao');
      await findClientResources(token, page, limit);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          attributes: ALL_ATTRIBUTES,
          where: {
            oauthClientId,
          },
          offset,
          limit,
          order,
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
            oauthClientId,
          },
          offset,
          limit,
          order,
        })
      );
    });
  });

  describe('createResource', () => {
    let spy;

    it('should create a new resource for the provided token only if the token has higher scope', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClientResources, 'create');
      });
      const { createResource } = require('@daos/oauthClientResourcesDao');
      await createResource(resource, superAdminToken);
      expect(spy).toBeCalledWith({
        ...resource,
        oauthClientId: resource.oauthClientId,
      });
      await expect(createResource(resource, userToken)).rejects.toThrow(
        'not authorized to create resources'
      );
    });
  });

  describe('updateResource', () => {
    let spy;
    it('should update the resource only if a resource is found and the token has higher scope', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClientResources, 'findOne');
      });
      const { updateResource } = require('@daos/oauthClientResourcesDao');

      const updatedResource = await updateResource(resource, superAdminToken);
      expect(spy).toBeCalled();
      expect(updatedResource.resourceId).toEqual(resource.resourceId);
      // setting findOne finder to return null to test the case where resource is not found
      await resetAndMockDB((db) => {
        db.models.oauthClientResources.findOne = () => null;
      });
      await expect(updateResource(resource, superAdminToken)).rejects.toThrow();
      // setting token priority as USER, lower than the resource proirity of ADMIN
      await resetAndMockDB();
      await expect(updateResource(resource, userToken)).rejects.toThrow();
    });

    it('should catch an error if findResourceWithOauthClientId fails', async () => {
      await resetAndMockDB((db) => {
        db.models.oauthClientResources.findOne = async () => {
          throw new Error('resource not found');
        };
      });
      const { updateResource } = require('@daos/oauthClientResourcesDao');

      expect(updateResource(resource, superAdminToken)).rejects.toThrow();
    });
  });

  describe('createOauthResources', () => {
    it('should call bulkCreate mutation of oauthClientResources', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClientResources, 'bulkCreate');
      });
      const resources = mockData.MOCK_OAUTH_CLIENT_RESOURCES;
      const transaction = 1;
      const { createOauthResources } = require('@daos/oauthClientResourcesDao');
      await createOauthResources({ oauthClientId, resources }, transaction);
      expect(spy).toBeCalledWith(
        expect.objectContaining(
          resources.map((resource) => ({
            ...resource,
            oauthClientId,
          }))
        ),
        expect.objectContaining({ transaction })
      );
    });
  });
});
