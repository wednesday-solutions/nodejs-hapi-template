import isNil from 'lodash/isNil';
import { updateAccessToken, findAccessToken } from '@daos/oauthAccessTokensDao';
import { unauthorized } from '@utils/responseInterceptors';
import paths from '@config/paths';
import { SLIDING_WINDOW } from '@utils/constants';
import { validateScopeForRoute } from '@utils';

export default {
  allowQueryToken: false,
  allowCookieToken: false,
  validate: async (request, token) => {
    const credentials = await findAccessToken(token);
    if (isNil(credentials)) {
      throw unauthorized('Access denied. Unauthorized user.');
    }
    const artifacts = credentials.metadata;
    const isValid = await validateScopeForRoute({
      paths,
      request,
      credentials,
    });
    updateAccessToken(token, SLIDING_WINDOW);

    return {
      isValid,
      credentials,
      artifacts,
    };
  },
};
