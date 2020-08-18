import isNil from 'lodash/isNil';
import includes from 'lodash/includes';
import { updateAccessToken, findAccessToken } from 'daos/oauthAccessTokensDao';
import { getMetaDataByOAuthClientId } from 'daos/oauthClientsDao';
import { unauthorized } from 'utils/responseInterceptors';
import { path } from 'config/path';
import { SLIDING_WINDOW } from 'utils/constants';

export default {
    allowQueryToken: false,
    allowCookieToken: false,
    validate: async (request, token, h) => {
        const credentials = await findAccessToken(token);
        console.log({ credentials });
        if (isNil(credentials)) {
            throw unauthorized(`Access denied. Unauthorized user.`);
        }
        const isValid = token === credentials.accessToken;

        const artifacts = credentials.metadata;

        const client = await getMetaDataByOAuthClientId(
            credentials.oauthClientId
        );
        let isAllowed = true;
        if (isValid) {
            path.forEach(route => {
                if (
                    request.route.path === route.path &&
                    request.route.method === route.method
                ) {
                    isAllowed = includes(route.scopes, client.scope.scope);
                }
            });
            updateAccessToken(token, SLIDING_WINDOW);
        }

        return {
            isValid: isValid && isAllowed,
            credentials,
            artifacts
        };
    }
};
