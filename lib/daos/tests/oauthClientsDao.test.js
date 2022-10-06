import { resetAndMockDB } from '@utils/testUtils';
import { mockData } from '@utils/mockData';
import { SCOPE_TYPE, GRANT_TYPE } from '@utils/constants';

describe('oauthClients Dao tests', () => {
  let spy;
  const grantType = GRANT_TYPE.CLIENT_CREDENTIALS;
  const oauthClient = mockData.MOCK_OAUTH_CLIENTS();
  const { clientId } = mockData.MOCK_OAUTH_CLIENTS();
  let clientSecret = 'TEST';
  const resources = mockData.MOCK_OAUTH_CLIENT_RESOURCES;
  const scope = SCOPE_TYPE.ADMIN;
  const transaction = 1;

  describe('findOneOauthClient', () => {
    const attributes = ['id', 'grant_type', 'client_id', 'client_secret'];

    it('should call findOne of oauthClients', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClients, 'findOne');
      });
      const { findOneOauthClient } = require('@daos/oauthClientsDao');
      await findOneOauthClient(grantType, clientId, clientSecret);

      expect(spy).toBeCalledWith(
        expect.objectContaining({
          attributes,
          where: {
            grantType,
            clientId,
            clientSecret,
          },
          raw: true,
        })
      );
    });
  });
  describe('getMetaDataByOAuthClientId', () => {
    let spy;
    it('should get the metadata of an oauthclient by Id', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClients, 'findOne');
      });
      const { getMetaDataByOAuthClientId } = require('@daos/oauthClientsDao');
      await getMetaDataByOAuthClientId(clientId);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          where: { id: clientId },
          include: expect.anything(),
        })
      );
    });
    it('should return null if oauthClient was not found', async () => {
      await resetAndMockDB((db) => {
        db.models.oauthClients.findOne = () =>
          new Promise((resolve) => resolve(null));
      });
      const { getMetaDataByOAuthClientId } = require('@daos/oauthClientsDao');
      const metadata = await getMetaDataByOAuthClientId(clientId);
      expect(metadata).toBe(null);
    });
  });

  describe('createOauthClient', () => {
    it('should throw an error if secret is not provided', async () => {
      const { createOauthClient } = require('@daos/oauthClientsDao');
      clientSecret = null;
      await expect(
        createOauthClient(
          {
            clientId,
            clientSecret,
            grantType,
            scope,
            resources,
          },
          transaction
        )
      ).rejects.toThrow();
    });
    it('should call create mutation of oauthClients create', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClients, 'create');
      });
      clientSecret = 'TEST';
      const { createOauthClient } = require('@daos/oauthClientsDao');
      await createOauthClient(
        {
          clientId,
          clientSecret,
          grantType,
          scope,
          resources,
        },
        transaction
      );
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          clientId,
          clientSecret,
          grantType,
        }),
        expect.objectContaining({ transaction })
      );
      jest.clearAllMocks();
      // secret set as '' by default
      expect(
        createOauthClient(
          {
            clientId,
            grantType,
            scope,
            resources,
          },
          transaction
        )
      ).rejects.toThrow();
    });
    it('should call bulkCreate on oauthClientResources with the correct parameters', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClientResources, 'bulkCreate');
      });
      const { createOauthClient } = require('@daos/oauthClientsDao');
      await createOauthClient(
        {
          clientId,
          clientSecret,
          grantType,
          scope,
          resources,
        },
        transaction
      );
      expect(spy).toBeCalledWith(
        expect.arrayContaining(
          resources.map((resource) => ({
            ...resource,
            oauthClientId: oauthClient.id,
          }))
        ),
        expect.objectContaining({ transaction })
      );
      jest.clearAllMocks();
      // no resources passed
      await createOauthClient(
        {
          clientId,
          clientSecret,
          grantType,
          scope,
        },
        transaction
      );
      expect(spy).not.toBeCalled();
    });
    it('should call create on oauth_client_scopes', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClientScopes, 'create');
      });
      const { createOauthClient } = require('@daos/oauthClientsDao');
      await createOauthClient(
        {
          clientId,
          clientSecret,
          grantType,
          scope,
          resources,
        },
        transaction
      );
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          scope,
          oauthClientId: oauthClient.id,
        }),
        expect.objectContaining({ transaction })
      );
      jest.clearAllMocks();
      // no scope passed
      await createOauthClient(
        {
          clientId,
          clientSecret,
          grantType,
          resources,
        },
        transaction
      );
      expect(spy).not.toBeCalled();
    });
    it('should work without clientSecret if grantType is not CLIENT_CREDENTIALS', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClientScopes, 'create');
      });
      const { createOauthClient } = require('@daos/oauthClientsDao');
      await createOauthClient(
        {
          clientId,
          grantType: 'TEST',
          scope,
          resources,
        },
        transaction
      );
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          scope,
          oauthClientId: oauthClient.id,
        }),
        expect.objectContaining({ transaction })
      );
    });
  });
  describe('findAllOauthClients', () => {
    const page = 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const attributes = ['clientId', 'grantType'];

    it('should call findAll of oauthClients', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClients, 'findAll');
      });
      const { findAllOauthClients } = require('@daos/oauthClientsDao');
      await findAllOauthClients(page, limit);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          attributes,
          include: expect.anything(),
          offset,
          limit,
          order: [['id', 'ASC']],
        })
      );
    });
  });
});
