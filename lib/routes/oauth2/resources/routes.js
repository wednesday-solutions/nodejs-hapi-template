import Joi from 'joi';
import {
  findClientResources,
  findResource,
  createResource,
  updateResource,
} from '@daos/oauthClientResourcesDao';
import { notFound, badRequest } from '@utils/responseInterceptors';
import {
  idAllowedSchema,
  stringAllowedSchema,
  numberAllowedSchema,
  idOrUUIDAllowedSchema,
} from '@utils/validationUtils';

export default [
  {
    method: 'GET',
    path: '/',
    handler: async (request) => {
      const { page, limit } = request.query;
      const resources = await findClientResources(
        request.auth.credentials,
        page,
        limit,
      );
      if (!resources) {
        return notFound(
          `No resources were found for oauthClientId:${request.auth.credentials.oauthClientId}`,
        );
      }
      return resources;
    },
    options: {
      description: 'get all resources for this authClient',
      notes: 'GET resources API',
      tags: ['api', 'oauth2-resources'],
      plugins: {
        pagination: {
          enabled: true,
        },
        query: {
          pagination: true,
        },
      },
      validate: {
        query: Joi.object({
          page: numberAllowedSchema,
          limit: numberAllowedSchema,
        }),
      },
    },
  },
  {
    method: 'GET',
    path: '/{resourceId}',
    handler: async (request) => {
      const { resourceId } = request.params;
      const resource = await findResource(
        resourceId,
        request.auth.credentials,
      );
      if (!resource) {
        return notFound(
          `No resource was found for resourceId:${resourceId} for current user`,
        );
      }
      return resource;
    },
    options: {
      description: 'get resource by ID',
      notes: 'API to get resource by ID',
      tags: ['api', 'oauth2-resources'],
    },
  },
  {
    method: 'POST',
    path: '/',
    handler: async (request) => {
      // pass oauth client id and make sure current oauth clientId
      // is more powerful than the one we are updating
      const { resourceId, resourceType, oauthClientId } = request.payload;
      try {
        return await createResource(
          {
            resourceId,
            resourceType,
            oauthClientId,
          },
          request.auth.credentials,
        );
      } catch (e) {
        return badRequest(e.message);
      }
    },
    options: {
      description: 'create resource',
      notes: 'API to create resource',
      tags: ['api', 'oauth2-resources'],
      validate: {
        payload: Joi.object({
          oauth_client_id: idAllowedSchema,
          resource_id: idOrUUIDAllowedSchema,
          resource_type: stringAllowedSchema,
        }),
      },
    },
  },
  {
    method: 'PATCH',
    path: '/{resourceId}',
    handler: async (request) => {
      const { resourceId: id } = request.params;
      const { oauthClientId, resourceId, resourceType } = request.payload;

      try {
        return await updateResource(
          {
            id,
            resourceId,
            resourceType,
            oauthClientId,
          },
          request.auth.credentials,
        );
      } catch (e) {
        return badRequest(e.message);
      }
    },
    options: {
      description: 'update resource by id',
      notes: 'API to update resource by id',
      tags: ['api', 'oauth2-resources'],
      validate: {
        payload: Joi.object({
          oauth_client_id: idAllowedSchema,
          resource_id: idOrUUIDAllowedSchema,
          resource_type: stringAllowedSchema,
        }),
      },
    },
  },
];
