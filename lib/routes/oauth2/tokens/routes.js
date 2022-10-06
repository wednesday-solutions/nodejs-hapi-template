import isNil from 'lodash/isNil';
import Joi from 'joi';
import { unauthorized, badImplementation } from '@utils/responseInterceptors';
import {
  clientCredentialsSchema,
  grantTypeSchema,
} from '@utils/validationUtils';
import { createAccessToken } from '@daos/oauthAccessTokensDao';
import { findOneOauthClient } from '@daos/oauthClientsDao';
import { INVALID_CLIENT_CREDENTIALS } from '@utils/constants';

export default [
  {
    method: 'POST',
    path: '/',
    handler: async (request) => {
      const { grantType, clientId, clientSecret } = request.payload;
      return findOneOauthClient(grantType, clientId, clientSecret).then(
        (oauthClient) => {
          if (isNil(oauthClient)) {
            return unauthorized(INVALID_CLIENT_CREDENTIALS);
          }
          return createAccessToken(oauthClient.id).catch((error) => {
            request.log('error', error);
            throw badImplementation(
              'Error while creating access token',
              error.message,
            );
          });
        },
      );
    },
    options: {
      description: 'create access token',
      notes: 'API to create access token',
      tags: ['api', 'oauth2-tokens'],
      plugins: {
        'hapi-rate-limit': {
          userPathLimit: 5,
          expiresIn: 60000,
        },
      },
      auth: false,
      validate: {
        payload: Joi.object({
          grant_type: grantTypeSchema,
          client_id: clientCredentialsSchema,
          client_secret: clientCredentialsSchema.optional(),
          id_token: Joi.string().optional(),
        }).options({
          stripUnknown: true,
        }),
      },
    },
  },
];
