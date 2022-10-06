import Joi from 'joi';
import { badData } from '@utils/responseInterceptors';
import {
  idOrUUIDAllowedSchema,
  stringAllowedSchema,
  oneOfAllowedScopes,
  grantTypeSchema,
} from '@utils/validationUtils';
import { createOauthClient } from '@daos/oauthClientsDao';

export default [
  {
    method: 'POST',
    path: '/',
    options: {
      description: 'generate oauth client',
      notes: 'POST Oauth Client API',
      tags: ['api', 'oauth2-clients'],
      plugins: {
        'hapi-rate-limit': {
          userPathLimit: 5,
          expiresIn: 60000,
        },
      },
      validate: {
        payload: Joi.object({
          resources: Joi.array().items({
            resource_id: idOrUUIDAllowedSchema,
            resource_type: stringAllowedSchema,
          }),
          scope: oneOfAllowedScopes,
          client_id: Joi.string().required(),
          client_secret: Joi.string().optional(),
          grant_type: grantTypeSchema,
        }),
      },
    },
    handler: (request) => {
      const { scope, resources, grantType, clientId, clientSecret } =
        request.payload;
      return createOauthClient({
        clientId,
        clientSecret,
        grantType,
        scope,
        resources,
      }).catch((e) => badData(`Erorr while creating entity: ${e.message}`));
    },
  },
];
