import { v4 as uuidv4 } from 'uuid';
import get from 'lodash/get';
import find from 'lodash/find';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import includes from 'lodash/includes';
import {
    ADMINS,
    SCOPE_TYPE,
    OAUTH_CLIENT_ID,
    SUPER_SCOPES,
    USER_ID
} from '@utils/constants';
import { getMetaDataByOAuthClientId } from '@daos/oauthClientsDao';
import { TIMESTAMP } from './constants';
import { findOneUser } from '@daos/userDao';
import { createLogger, format, transports } from 'winston';
import rTracer from 'cls-rtracer';

const { combine, timestamp, printf } = format;

export const formatWithTimestamp = date =>
    date ? date.format(TIMESTAMP) : null;

export const strippedUUID = () => uuidv4().replace(/-/g, '');
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
export const getScopeFromToken = token => get(token, 'metadata.scope.scope');
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
        validateResources(
            get(token, 'metadata'),
            OAUTH_CLIENT_ID,
            oauthClientId
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

/** Checks whether the provided oauthClientId has scope over a given userId
 * @param  {String} oauthClientId
 * @param  {Number} userId
 * @returns {Boolean}
 */
export async function hasScopeOverUser({
    oauthClientId,
    userId,
    scope = null
}) {
    if (scope === null) {
        scope = await getScope(oauthClientId);
    }
    if (includes(SUPER_SCOPES, scope)) {
        return true;
    } else if (scope === SCOPE_TYPE.ADMIN) {
        const metadata = await getMetaDataByOAuthClientId(oauthClientId);
        return await validateResources(metadata, USER_ID, userId);
    } else if (scope === SCOPE_TYPE.USER) {
        const result = await findOneUser(userId);
        if (!isNil(result)) {
            return result.oauth_client_id === oauthClientId;
        }
        return false;
    }
}

/** Validate if the provided metadata has a given resourceType and resourceId
 * @param  {Object} metadata
 * @param  {String} resourceType
 * @param  {Number} resourceId
 * @returns {Boolean}
 */
export function validateResources(metadata, resourceType, resourceId) {
    const resources = get(metadata, 'resources', []);
    return !isEmpty(
        find(
            resources,
            resource =>
                resource.resource_type === resourceType &&
                resource.resource_id === resourceId
        )
    );
}
/**
 * Validates the scope of credentials for the request route
 * @param  {Array} paths
 * @param  {Object} request
 * @param  {Object} credentials
 * @returns {Boolean}
 */
export async function validateScopeForRoute({ paths, request, credentials }) {
    let isAllowed = true;
    const scope = await getScope(credentials.oauthClientId);
    await Promise.all(
        paths.map(async route => {
            if (
                request.route.path === route.path &&
                request.route.method.toUpperCase() ===
                    route.method.toUpperCase()
            ) {
                isAllowed =
                    includes(route.scopes, scope) &&
                    (route.customValidator
                        ? await route.customValidator({
                              oauthClientId: get(credentials, 'oauthClientId'),
                              userId: get(request, 'params.userId'),
                              scope
                          })
                        : true);
            }
        })
    );
    return isAllowed;
}
export const stringifyWithCheck = message => {
    try {
        return JSON.stringify(message);
    } catch (err) {
        if (message.data) {
            return stringifyWithCheck(message.data);
        } else {
            console.log(message);
            return `unable to unfurl message: ${message}`;
        }
    }
};

export const logger = () => {
    const rTracerFormat = printf(info => {
        const rid = rTracer.id();
        const infoSplat = info[Symbol.for('splat')] || [];
        const infoSplatObject = { ...infoSplat };
        return rid
            ? `${info.timestamp} [request-id:${rid}]: ${stringifyWithCheck(
                  info.message
              )} ${stringifyWithCheck(infoSplatObject)}`
            : `${info.timestamp}: ${stringifyWithCheck(
                  info.message
              )} ${stringifyWithCheck(infoSplatObject)}`;
    });
    return createLogger({
        format: combine(timestamp(), rTracerFormat),
        transports: [new transports.Console()]
    });
};

export const getLogger = () => {
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        return console.log;
    } else if (process.env.NODE_ENV === 'test') {
        return false;
    } else {
        return args => logger().info(args);
    }
};
