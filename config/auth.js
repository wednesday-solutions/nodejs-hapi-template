import isNil from 'lodash/isNil';
import includes from 'lodash/includes';
import { updateAccessToken, findAccessToken } from 'daos/oauthAccessTokensDao';
import { getMetaDataByOAuthClientId } from 'daos/oauthClientsDao';
import { unauthorized } from 'utils/responseInterceptors';
import { paths } from 'config/paths';
import { SLIDING_WINDOW, GET_USER_PATH } from 'utils/constants';
import { hasScopeOverUser } from 'utils';

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
                request.route.method.toUpperCase() ===
                    route.method.toUpperCase()
            ) {
                isAllowed = route.customValidator
                    ? route.customValidator(credentials, request) &&
                      includes(route.scopes, client.scope.scope)
                    : includes(route.scopes, client.scope.scope);
            }
        });

        if (request.route.path === GET_USER_PATH) {
            const hasValidScope = await hasScopeOverUser(
                credentials.oauthClientId,
                request.params.userId
            );
            isAllowed = hasValidScope && isAllowed;
        }

        updateAccessToken(token, SLIDING_WINDOW);

        return {
            isValid: isAllowed,
            credentials,
            artifacts
        };
    }
};
