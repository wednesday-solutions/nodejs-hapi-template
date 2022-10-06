import { models } from '@models';
// eslint-disable-next-line import/no-cycle
import { hasPowerOver } from '@utils';
import { unauthorized, badRequest } from '@utils/responseInterceptors';

const ALL_ATTRIBUTES = [
  'id',
  'oauthClientId',
  'scope',
  'createdAt',
  'updatedAt',
];
export const findScope = (id, token) => {
  const { oauthClientId } = token;
  return models.oauthClientScopes.findOne({
    attributes: ALL_ATTRIBUTES,
    where: {
      id,
      oauthClientId,
    },
  });
};

export const findClientScopes = (token, page, limit) => {
  const { oauthClientId } = token;
  return models.oauthClientScopes.findAll({
    attributes: ALL_ATTRIBUTES,
    where: {
      oauthClientId,
    },
    offset: (page - 1) * limit,
    limit,
    order: [['id', 'ASC']],
  });
};

export const findScopeFromOauthClientId = (oauthClientId) =>
  models.oauthClientScopes.findOne({
    attributes: ALL_ATTRIBUTES,
    where: {
      oauthClientId,
    },
  });
export const updateScope = async (scope, oauthClientId, token) => {
  if (hasPowerOver(token, oauthClientId, scope)) {
    return models.oauthClientScopes
      .update(
        {
          scope,
        },
        {
          where: {
            oauthClientId,
          },
        }
      )
      .then(() => findScopeFromOauthClientId(oauthClientId))
      .catch(() =>
        badRequest(
          `Unable top update scope: ${scope} for oauthClient: ${oauthClientId}`
        )
      );
  }
  throw unauthorized(
    `User with clientId: ${token.oauthClientId} is not authorized to update this scope.`
  );
};
export const createOauthScope = ({ oauthClientId, scope }, t) =>
  models.oauthClientScopes.create({ scope, oauthClientId }, { transaction: t });
