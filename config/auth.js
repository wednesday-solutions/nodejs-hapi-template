import isNil from 'lodash/isNil';
import includes from 'lodash/includes';
import { updateAccessToken, findAccessToken } from 'daos/oauthAccessTokensDao';
import { getMetaDataByOAuthClientId } from 'daos/oauthClientsDao';
import { unauthorized } from 'utils/responseInterceptors';
import { paths } from 'config/paths';
import { SLIDING_WINDOW } from 'utils/constants';

export default {
    allowQueryToken: false,
    allowCookieToken: false,
    validate: async (request, token, h) => {
        const credentials = await findAccessToken(token);
        if (isNil(credentials)) {
            throw unauthorized(`Access denied. Unauthorized user.`);
        }
        const artifacts = credentials.metadata;

        const client = await getMetaDataByOAuthClientId(
            credentials.oauthClientId
        );
        let isAllowed = true;

        paths.forEach(route => {
            if (
                request.route.path === route.path &&
                request.route.method === route.method
            ) {
                isAllowed = includes(route.scopes, client.scope.scope);
            }
        });
        updateAccessToken(token, SLIDING_WINDOW);

        return {
            isValid: isAllowed,
            credentials,
            artifacts
        };
    }
};
