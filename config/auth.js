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
        async function validateScope() {
            let route;
            for (let index = 0; index < paths.length; index++) {
                route = paths[index];
                if (
                    request.route.path === route.path &&
                    request.route.method.toUpperCase() ===
                        route.method.toUpperCase()
                ) {
                    isAllowed = route.customValidator
                        ? (await route.customValidator(credentials, request)) &&
                          includes(route.scopes, client.scope.scope)
                        : includes(route.scopes, client.scope.scope);
                }
            }
            return isAllowed;
        }
        isAllowed = await validateScope();
        updateAccessToken(token, SLIDING_WINDOW);

        return {
            isValid: isAllowed,
            credentials,
            artifacts
        };
    }
};
