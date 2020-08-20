import uuid from 'uuid';
import get from 'lodash/get';
import find from 'lodash/find';
import includes from 'lodash/includes';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import {
    ADMINS,
    SCOPE_TYPE,
    OAUTH_CLIENT_ID,
    SUPER_SCOPES,
    USER_ID
} from 'utils/constants';
import { getMetaDataByOAuthClientId } from 'daos/oauthClientsDao';
import { TIMESTAMP } from './constants';
import { findOneUser } from 'daos/userDao';

export const getEnv = () => {
    switch (process.env.NODE_ENV) {
        case 'production':
            return 'production';
        case 'qa':
            return 'qa';
        case 'staging':
            return 'staging';
        default:
            return 'development';
    }
};

export const formatWithTimestamp = date =>
    date ? date.format(TIMESTAMP) : null;

export const strippedUUID = () => uuid.v4().replace(/-/g, '');
/**
 * checks if this token belongs to an ADMIN
 * @date 2020-03-21
 * @param {any} token
 * @returns {any}
 */
export const isAdmin = token => !!includes(ADMINS, getScopeFromToken(token));

/**
 * checks if the token has higher scope then the passed scope variable
 * @date 2020-03-21
 * @param {any} token
 * @param {any} scope
 * @returns {any}
 */
export const isScopeHigher = (token, scope) => {
    switch (scope) {
        case SCOPE_TYPE.USER:
            return includes(ADMINS, getScopeFromToken(token));
        case SCOPE_TYPE.ADMIN:
        case SCOPE_TYPE.SUPER_ADMIN:
            return getScopeFromToken(token) === SCOPE_TYPE.SUPER_ADMIN;
        default:
            return false;
    }
};

/**
 * Get scope from the token object
 * @date 2020-03-21
 * @param {any} token
 * @returns {any}
 */
const getScopeFromToken = token => get(token, 'metadata.scope.scope');
/**
 * Checks if the oauthClientId that is passed is a resource of the
 * token bearer and if the token bearer has the authority to grant the scope that was
 * passed as a parameter
 * @date 2020-03-21
 * @param {any} token
 * @param {any} oauthClientId
 * @param {any} scope
 * @returns {any}
 */
export const hasPowerOver = (token, oauthClientId, scope) => {
    if (getScopeFromToken(token) === SCOPE_TYPE.SUPER_ADMIN) {
        return true;
    }
    return (
        find(
            get(token, 'metadata.resources', []),
            resource =>
                resource.resource_type === OAUTH_CLIENT_ID &&
                // eslint-disable-next-line eqeqeq
                resource.resource_id == oauthClientId
        ) && isScopeHigher(token, scope)
    );
};

/**
 * Gets the from the oauthClientId from the database if not already present
 * @date 2020-03-21
 * @param {any} scope
 * @returns {any}
 */
export const getScope = oauthClientId =>
    getMetaDataByOAuthClientId(oauthClientId).then(metadata =>
        get(metadata, 'scope.scope')
    );

export async function hasScopeOverUser(oauthClientId, userId) {
    const scope = await getScope(oauthClientId);
    if (includes(SUPER_SCOPES, scope)) {
        return true;
    } else if (scope === SCOPE_TYPE.ADMIN) {
        const metadata = await getMetaDataByOAuthClientId(oauthClientId);
        const resources = get(metadata, 'resources', []);
        return !isEmpty(
            resources.filter(
                resource =>
                    resource.resource_type === USER_ID &&
                    resource.resource_id === userId
            )
        );
    } else if (scope === SCOPE_TYPE.USER) {
        const result = await findOneUser(userId);
        if (!isNil(result)) {
            return result.oauth_client_id === oauthClientId;
        }
        return false;
    }
}
