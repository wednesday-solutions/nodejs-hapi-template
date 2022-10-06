import isEmpty from 'lodash/isEmpty';
import { models } from '@models';
// eslint-disable-next-line import/no-cycle
import { hasPowerOver, getScope, logger } from '@utils';
import { unauthorized, badRequest } from '@utils/responseInterceptors';

const ALL_ATTRIBUTES = [
  'id',
  'oauthClientId',
  'resourceType',
  'resourceId',
  'createdAt',
  'updatedAt',
];

/**
 * Find resource where id = id and oauthClientId = oauthClientId
 * @date 2020-03-21
 * @param {any} id
 * @param {any} oauthClientId
 * @returns {any}
 */
export const findResourceWithOauthClientId = (id, oauthClientId) =>
  models.oauthClientResources.findOne({
    attributes: ALL_ATTRIBUTES,
    where: {
      id,
      oauthClientId,
    },
    raw: true,
  });

/**
 * Find resource where id = id and oauthClient = token.oauthClientId
 * @date 2020-03-21
 * @param {any} id
 * @param {any} token
 * @returns {any}
 */
export const findResource = (id, token) =>
  findResourceWithOauthClientId(id, token.oauthClientId);

/**
 * paginated dao method to get all resources for this client
 * @date 2020-03-21
 * @param {any} token
 * @param {any} page
 * @param {any} limit
 * @returns {any}
 */
export const findClientResources = (token, page, limit) => {
  const { oauthClientId } = token;
  return models.oauthClientResources.findAll({
    attributes: ALL_ATTRIBUTES,
    where: {
      oauthClientId,
    },
    offset: (page - 1) * limit,
    limit,
    order: [['id', 'ASC']],
  });
};

/**
 * Create a resource with the details passed in @resource after validating
 * that the bearer of token has the right to create resources for @resource.oauthClientId
 * @date 2020-03-21
 * @param {any} resource
 * @param {any} token
 * @returns {any}
 */
export const createResource = async (resource, token) => {
  const scope = await getScope(resource.oauthClientId);
  if (hasPowerOver(token, resource.oauthClientId, scope)) {
    return models.oauthClientResources.create({
      ...resource,
      oauthClientId: resource.oauthClientId,
    });
  }
  throw unauthorized(
    `User with clientId: ${token.oauthClientId} is not authorized to create resources.`
  );
};

export const updateResource = async (resource, token) => {
  const scope = await getScope(resource.oauthClientId);
  if (hasPowerOver(token, resource.oauthClientId, scope)) {
    // we have power to update resources that belong to
    // resource.oauthClientId
    try {
      const foundResource = await findResourceWithOauthClientId(
        resource.id,
        resource.oauthClientId
      );
      if (!isEmpty(foundResource)) {
        return models.oauthClientResources
          .update(
            {
              resourceType: resource.resourceType || foundResource.resourceType,
              resourceId: resource.resourceId || foundResource.resourceId,
            },
            {
              where: {
                id: resource.id,
                oauthClientId: resource.oauthClientId,
              },
            }
          )
          .then(() =>
            findResourceWithOauthClientId(resource.id, resource.oauthClientId)
          );
      }
    } catch (e) {
      logger().error({
        e,
      });
    }
    throw badRequest(
      `Unable to update resource with resourceId: ${resource.id}, oauthClientId: ${resource.oauthClientId}`
    );
  }
  throw unauthorized(
    `User with clientId: ${token.oauthClientId} is not authorized to update this resource.`
  );
};

/**
 * Creating oauth resources for the client
 * @author mac
 * @date 2020-03-21
 * @param {any} oauthClientId
 * @param {any} resources
 * @returns {any}
 */
export const createOauthResources = ({ oauthClientId, resources }, t) =>
  models.oauthClientResources.bulkCreate(
    resources.map((resource) => ({ ...resource, oauthClientId })),
    { transaction: t }
  );
