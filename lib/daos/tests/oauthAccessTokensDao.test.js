import { resetAndMockDB } from '@utils/testUtils';
import { mockData, mockMetadata } from '@utils/mockData';
import server from '@config/server';

describe('oauthAccessTokenDao', () => {
  const { MOCK_OAUTH_CLIENTS: authClientsMockData } = mockData;
  const metaData = mockMetadata();
  const oauthClientId = authClientsMockData().id;

  describe('createAccessToken', () => {
    let spy;
    const ttl = server.app.options.oauth.access_token_ttl;
    const BEARER = 'Bearer';

    it('should call create in the oauthAcessTokens with the correct parameters', async () => {
      await resetAndMockDB((db) => {
        db.models.oauthAccessTokens.create = async (value) => ({
          get: () => value,
        });
        spy = jest.spyOn(db.models.oauthAccessTokens, 'create');
      });
      const { createAccessToken } = require('@daos/oauthAccessTokensDao');
      await createAccessToken(oauthClientId, ttl);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: expect.any(String),
          oauthClientId,
          expiresIn: ttl,
          expiresOn: expect.any(String),
          tokenType: BEARER,
          metadata: JSON.stringify({
            scope: metaData.oauth_client_scope.get(),
            resources: metaData.oauth_client_resources.map((resource) =>
              resource.get()
            ),
          }),
        })
      );
    });

    it('should call the findOne finder of oauth_clients with the provided ID ', async () => {
      await resetAndMockDB((db) => {
        db.models.oauthAccessTokens.create = async (value) => ({
          get: () => value,
        });
        spy = jest.spyOn(db.models.oauthClients, 'findOne');
      });
      const { createAccessToken } = require('@daos/oauthAccessTokensDao');
      await createAccessToken(oauthClientId, ttl);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          where: { id: oauthClientId },
        })
      );
    });
    it('should catch an error if no metadata is found', async () => {
      await resetAndMockDB((db) => {
        db.models.oauthClients.findOne = () =>
          new Promise((resolve) => resolve(null));
      });
      const { createAccessToken } = require('@daos/oauthAccessTokensDao');
      expect(createAccessToken(oauthClientId, ttl)).rejects.toThrow();
    });
  });

  describe('findAccessToken', () => {
    let spy;
    const attributes = [
      'accessToken',
      'metadata',
      'expiresIn',
      'expiresOn',
      'oauthClientId',
    ];
    const accessToken = 1;

    it('should return a null token if no tokens are found', async () => {
      await resetAndMockDB((db) => {
        db.models.oauthAccessTokens.findOne = async () => null;
      });
      const { findAccessToken } = require('@daos/oauthAccessTokensDao');
      expect(await findAccessToken(accessToken)).toEqual(null);
    });

    it('should call findOne in the oauthAccessTokens table with the correct parameters ', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthAccessTokens, 'findOne');
      });
      const { findAccessToken } = require('@daos/oauthAccessTokensDao');
      const { accessToken: token } = await findAccessToken(accessToken);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes,
          where: {
            accessToken,
            expiresOn: expect.anything(),
          },
          include: expect.anything(),
        })
      );
      expect(accessToken).toEqual(token);
    });
  });

  describe('updateAccessToken', () => {
    let spy;
    const accessToken = 1;
    const ttl = server.app.options.oauth.access_token_ttl;

    it('should call update mutation of oauthAccessTokens table', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthAccessTokens, 'update');
      });
      const { updateAccessToken } = require('@daos/oauthAccessTokensDao');
      await updateAccessToken(accessToken, ttl);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken,
          expiresIn: ttl,
          expiresOn: expect.any(String),
        }),
        expect.objectContaining({
          where: {
            accessToken,
          },
          underscoredAll: false,
        })
      );
    });
  });
});
