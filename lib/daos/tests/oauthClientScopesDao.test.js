import { resetAndMockDB } from '@utils/testUtils';
import { createMockTokenWithScope, mockData } from '@utils/mockData';
import { SCOPE_TYPE } from '@utils/constants';

describe('oauthClientScopes Dao tests', () => {
  const ALL_ATTRIBUTES = [
    'id',
    'oauthClientId',
    'scope',
    'createdAt',
    'updatedAt',
  ];
  const { MOCK_OAUTH_CLIENTS: authClientsMockData } = mockData;
  const oauthClientId = authClientsMockData.clientId;
  const token = { oauthClientId };
  const id = 1;

  describe('findScope', () => {
    let spy;
    it('should call findOne in oauthClientScopes to find the scope of the token that is passed', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClientScopes, 'findOne');
      });
      const { findScope } = require('@daos/oauthClientScopesDao');
      await findScope(id, token);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          attributes: ALL_ATTRIBUTES,
          where: {
            id,
            oauthClientId,
          },
        })
      );
    });
  });

  describe('findClientScopes', () => {
    let spy;
    const page = 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    it('should call findAll in oauthClientScopes to find all scopes of a client', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClientScopes, 'findAll');
      });
      const { findClientScopes } = require('@daos/oauthClientScopesDao');
      await findClientScopes(token, page, limit);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          attributes: ALL_ATTRIBUTES,
          where: {
            oauthClientId,
          },
          offset,
          limit,
          order: [['id', 'ASC']],
        })
      );
    });
  });

  describe('findScopeFromOauthClientId', () => {
    let spy;
    it('should call findOne in oauthClientScopes ', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClientScopes, 'findOne');
      });
      const {
        findScopeFromOauthClientId,
      } = require('@daos/oauthClientScopesDao');
      await findScopeFromOauthClientId(oauthClientId);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          attributes: ALL_ATTRIBUTES,
          where: {
            oauthClientId,
          },
        })
      );
    });
  });

  describe('updateScope', () => {
    let spy;
    let scope = SCOPE_TYPE.USER;
    const token = createMockTokenWithScope(SCOPE_TYPE.SUPER_ADMIN);
    const adminScopeToken = createMockTokenWithScope(SCOPE_TYPE.ADMIN);

    it('should call update mutation on oauthClientScopes when valid parameters are provided', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClientScopes, 'update');
      });
      const { updateScope } = require('@daos/oauthClientScopesDao');
      await updateScope(scope, oauthClientId, token);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          scope,
        }),
        expect.objectContaining({
          where: {
            oauthClientId,
          },
        })
      );
      // scope can be updated to SUPERADMIN by a SUPERADMIN
      await updateScope(scope, oauthClientId, token);
      expect(spy).toBeCalledWith(
        expect.objectContaining({
          scope,
        }),
        expect.objectContaining({
          where: {
            oauthClientId,
          },
        })
      );

      await resetAndMockDB((db) => {
        db.models.oauthClientScopes.update = () => null;
      });
      await expect(
        updateScope(scope, oauthClientId, adminScopeToken)
      ).rejects.toThrow();

      await resetAndMockDB();
      // scope cannot be updated to SUPERADMIN by an ADMIN
      scope = SCOPE_TYPE.SUPER_ADMIN;
      await expect(
        updateScope(scope, oauthClientId, adminScopeToken)
      ).rejects.toThrow();
    });
  });

  describe('createOauthScope', () => {
    let spy;
    it('should call create of oauthClientScopes', async () => {
      await resetAndMockDB((db) => {
        spy = jest.spyOn(db.models.oauthClientScopes, 'create');
      });
      const { createOauthScope } = require('@daos/oauthClientScopesDao');
      const scope = SCOPE_TYPE.ADMIN;
      const transaction = 1;
      await createOauthScope({ oauthClientId, scope }, transaction);
      await expect(spy).toBeCalledWith(
        expect.objectContaining({
          scope,
          oauthClientId,
        }),
        expect.objectContaining({ transaction })
      );
    });
  });
});
