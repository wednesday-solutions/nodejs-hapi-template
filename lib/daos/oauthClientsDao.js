import {
    oauth_client_resources as oauthClientResources,
    oauth_client_scopes as oauthClientScopes,
    oauth_clients as oauthClients
} from 'models';
import {
    transformDbArrayResponseToRawResponse,
    convertDbResponseToRawResponse
} from 'utils/transformerUtils';
import { createOauthResources } from './oauthClientResourcesDao';
import { createOauthScope } from './oauthClientScopesDao';
import { GRANT_TYPE } from 'utils/constants';
import { badRequest } from 'utils/responseInterceptors';

export const findOneOauthClient = (grantType, clientId, clientSecret) =>
    oauthClients.findOne({
        attributes: ['id', 'grant_type', 'client_id', 'client_secret'],
        where: {
            grantType,
            clientId,
            clientSecret
        },
        raw: true
    });

/**
 * A function that gets the oauth client metadata which comprises of scope & resources.
 *
 * metadata :{
 *          scope: SUPER_ADMIN // Always there will be one scope associated to the client.
 *          resources: the authorized resources a particular client can access.
 *   }
 * @param {Number} id
 */
export const getMetaDataByOAuthClientId = id =>
    oauthClients
        .findOne({
            where: { id },
            include: [oauthClientResources, oauthClientScopes]
        })
        .then(oauthClient => {
            if (!oauthClient) {
                return null;
            }
            const resources = transformDbArrayResponseToRawResponse(
                oauthClient.oauth_client_resources
            );

            const scope = convertDbResponseToRawResponse(
                oauthClient.oauth_client_scope
            );

            const metadata = {
                scope,
                resources
            };
            return metadata;
        });

export const createOauthClient = async (
    { clientId, clientSecret = '', grantType, scope, resources },
    t
) => {
    let secret = '';
    if (grantType === GRANT_TYPE.CLIENT_CREDENTIALS) {
        if (clientSecret) {
            secret = clientSecret;
        } else {
            throw badRequest(`${clientSecret} is required.`);
        }
    }
    const oauthClient = convertDbResponseToRawResponse(
        await oauthClients.create(
            {
                clientId,
                clientSecret: secret,
                grantType
            },
            { transaction: t }
        )
    );
    let oauthClientResources = null;
    let oauthClientScope = null;
    if (resources) {
        oauthClientResources = transformDbArrayResponseToRawResponse(
            await createOauthResources(
                { oauthClientId: oauthClient.id, resources },
                t
            )
        );
    }
    if (scope) {
        oauthClientScope = convertDbResponseToRawResponse(
            await createOauthScope({ oauthClientId: oauthClient.id, scope }, t)
        );
    }
    return {
        oauthClient: {
            clientId: oauthClient.clientId,
            grantType: oauthClient.grantType
        },
        resources: oauthClientResources,
        scopes: oauthClientScope
    };
};

export const findAllOauthClients = (page, limit) =>
    oauthClients.findAll({
        attributes: ['clientId', 'grantType'],
        include: [oauthClientResources, oauthClientScopes],
        offset: (page - 1) * limit,
        limit,
        order: [['id', 'ASC']]
    });
