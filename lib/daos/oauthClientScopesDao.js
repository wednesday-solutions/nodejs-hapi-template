import { oauth_client_scopes as oauthClientScopes } from 'models';
import { hasPowerOver } from 'utils';
import { unauthorized, badRequest } from 'utils/responseInterceptors';
const ALL_ATTRIBUTES = [
    'id',
    'oauthClientId',
    'scope',
    'createdAt',
    'updatedAt'
];
export const findScope = (id, token) => {
    const { oauthClientId } = token;
    return oauthClientScopes.findOne({
        attributes: ALL_ATTRIBUTES,
        where: {
            id,
            oauthClientId
        }
    });
};

export const findClientScopes = (token, page, limit) => {
    const { oauthClientId } = token;
    return oauthClientScopes.findAll({
        attributes: ALL_ATTRIBUTES,
        where: {
            oauthClientId
        },
        offset: (page - 1) * limit,
        limit,
        order: [['id', 'ASC']]
    });
};

export const findScopeFromOauthClientId = oauthClientId =>
    oauthClientScopes.findOne({
        attributes: ALL_ATTRIBUTES,
        where: {
            oauthClientId
        }
    });
export const updateScope = async (scope, oauthClientId, token) => {
    if (hasPowerOver(token, oauthClientId, scope)) {
        return oauthClientScopes
            .update(
                {
                    scope
                },
                {
                    where: {
                        oauthClientId
                    }
                }
            )
            .then(() => findScopeFromOauthClientId(oauthClientId))
            .catch(e =>
                badRequest(
                    `Unable top update scope: ${scope} for oauthClient: ${oauthClientId}`
                )
            );
    }
    throw unauthorized(
        `User with clientId: ${
            token.oauthClientId
        } is not authorized to update this scope.`
    );
};
export const createOauthScope = ({ oauthClientId, scope }, t) =>
    oauthClientScopes.create({ scope, oauthClientId }, { transaction: t });
