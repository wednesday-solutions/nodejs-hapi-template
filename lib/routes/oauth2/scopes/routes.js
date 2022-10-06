import Joi from 'joi';
import {
  findClientScopes,
  findScope,
  updateScope,
} from '@daos/oauthClientScopesDao';
import { notFound, badRequest } from '@utils/responseInterceptors';
import {
  numberAllowedSchema,
  oneOfAllowedScopes,
  idAllowedSchema,
} from '@utils/validationUtils';

export default [
  {
    method: 'GET',
    path: '/',
    handler: async (request) => {
      const { page, limit } = request.query;
      const scopes = await findClientScopes(
        request.auth.credentials,
        page,
        limit,
      );
      if (!scopes) {
        return notFound(
          `No scopes were found for oauthClientId:${request.oauthClientId}`,
        );
      }
      return scopes;
    },
    options: {
      description: 'Get all scopes for a particular oauth client id',
      tags: ['api', 'oauth2-scopes'],
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
    path: '/{scopeId}',
    handler: async (request) => {
      const { scopeId } = request.params;
      const scope = await findScope(scopeId, request.auth.credentials);
      if (!scope) {
        return notFound(
          `No scope was found for scopeId:${scopeId} for current user`,
        );
      }
      return scope;
    },
    options: {
      description: 'Get scope by id',
      notes: 'API to get scope by id',
      tags: ['api', 'oauth2-scopes'],
    },
  },
  {
    method: 'PATCH',
    path: '/',
    handler: async (request) => {
      const { scope, oauthClientId } = request.payload;
      try {
        return await updateScope(
          scope,
          oauthClientId,
          request.auth.credentials,
        );
      } catch (e) {
        return badRequest(e.message);
      }
    },
    options: {
      description: 'update scope by id',
      notes: 'API to update scope by id',
      tags: ['api', 'oauth2-scopes'],
      validate: {
        payload: Joi.object({
          scope: oneOfAllowedScopes,
          oauth_client_id: idAllowedSchema,
        }),
      },
    },
  },
];
