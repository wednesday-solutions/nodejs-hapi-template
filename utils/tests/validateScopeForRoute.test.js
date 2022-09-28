import find from 'lodash/find';
import paths from '@config/paths';
import {
  SCOPE_TYPE,
  USER_ID,
  GET_USER_PATH,
  OAUTH_CLIENT_ID,
} from '@utils/constants';
import { createMockTokenWithScope } from '@utils/mockData';
import { resetAndMockDB } from '@utils/testUtils';
import { findAccessToken } from '@daos/oauthAccessTokensDao';

describe('validateScopeForRoute', () => {
  const adminToken = createMockTokenWithScope(SCOPE_TYPE.ADMIN, USER_ID);
  const userToken = createMockTokenWithScope(SCOPE_TYPE.USER, USER_ID);
  const superAdminToken = createMockTokenWithScope(SCOPE_TYPE.SUPER_ADMIN);

  const getUserPathConfig = find(paths, (path) => {
    if (path.path === GET_USER_PATH) {
      return path;
    }
  });

  const request = {
    route: {
      path: getUserPathConfig.path,
      method: getUserPathConfig.method,
    },
    params: {
      userId: 1,
    },
  };

  it('should validate SCOPE for a SUPER_ADMIN Client', async () => {
    await resetAndMockDB(() => {}, {
      scope: SCOPE_TYPE.SUPER_ADMIN,
      resourceType: OAUTH_CLIENT_ID,
    });
    const { validateScopeForRoute } = require('@utils');
    const superAdminCredentials = await findAccessToken(superAdminToken);
    superAdminCredentials.oauthClientId = 1;
    let isValid = false;
    const payload = {
      paths,
      request,
      credentials: superAdminCredentials,
    };
    isValid = await validateScopeForRoute(payload);
    expect(isValid).toBeTruthy();
  });

  it('should validate SCOPE for an ADMIN Client', async () => {
    await resetAndMockDB(() => {}, {
      scope: SCOPE_TYPE.ADMIN,
      resourceType: USER_ID,
    });
    const adminCredentials = await findAccessToken(adminToken);

    const { validateScopeForRoute } = require('@utils');
    let isValid = false;
    isValid = validateScopeForRoute({
      paths,
      request,
      credentials: adminCredentials,
    });
    expect(isValid).toBeTruthy();
  });

  it('should validate scope for a USER scope client', async () => {
    await resetAndMockDB(() => {}, {
      scope: SCOPE_TYPE.USER,
      resourceType: OAUTH_CLIENT_ID,
    });
    const userCredentials = await findAccessToken(userToken);
    userCredentials.oauthClientId = 1;

    const { validateScopeForRoute } = require('@utils');
    let isValid = false;
    isValid = await validateScopeForRoute({
      paths,
      request,
      credentials: userCredentials,
    });
    expect(isValid).toBeTruthy();
    userCredentials.oauthClientId = 2;
    request.params.userId = 1;
    isValid = await validateScopeForRoute({
      paths,
      request,
      credentials: userCredentials,
    });
    expect(isValid).toBeFalsy();
  });
});
