import { Op } from 'sequelize';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import server from '@config/server';
import { models } from '@models';
import { TIMESTAMP, ACCESS_DENIED } from '@utils/constants';
import { strippedUUID } from '@utils';
import { unauthorized } from '@utils/responseInterceptors';
import { getMetaDataByOAuthClientId } from '@daos/oauthClientsDao';
import { convertDbResponseToRawResponse } from '@utils/transformerUtils';

const ttl = server.app.options.oauth.access_token_ttl;
const BEARER = 'Bearer';

export const createAccessToken = async (oauthClientId, timeToLive = ttl) => {
  const metadata = await getMetaDataByOAuthClientId(oauthClientId).catch(
    (error) => error,
  );

  if (isEmpty(metadata)) {
    throw unauthorized(ACCESS_DENIED);
  }

  return models.oauthAccessTokens
    .create({
      accessToken: strippedUUID(),
      oauthClientId,
      expiresIn: timeToLive,
      expiresOn: moment().add(timeToLive, 'seconds').format(TIMESTAMP),
      tokenType: BEARER,
      metadata: JSON.stringify(metadata),
      createdAt: moment(),
    })
    .then((accessToken) => convertDbResponseToRawResponse(accessToken));
};

/**
 * Find access token
 * @date 2020-03-21
 * @param {any} accessToken
 * @returns {any}
 */
export const findAccessToken = (accessToken) => models.oauthAccessTokens
    .findOne({
      attributes: [
        'accessToken',
        'metadata',
        'expiresIn',
        'expiresOn',
        'oauthClientId',
      ],
      where: {
        accessToken,
        expiresOn: {
          [Op.gt]: moment().format(TIMESTAMP),
        },
      },
      include: [
        {
          model: models.oauthClients,
          include: [
            {
              model: models.oauthClientResources,
            },
            {
              model: models.oauthClientScopes,
            },
          ],
        },
      ],
      underscoredAll: false,
    })
    .then((token) => {
      if (token) {
        return convertDbResponseToRawResponse(token);
      }
      return token;
    });

export const updateAccessToken = (accessToken, timeToLive) => models.oauthAccessTokens.update(
  {
    accessToken,
    expiresIn: ttl,
    expiresOn: moment().add(timeToLive, 'seconds').format(TIMESTAMP),
  },
  {
    where: {
      accessToken,
    },
    underscoredAll: false,
  },
);
