import { Op } from 'sequelize';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import server from 'config/server';
import {
    oauth_access_tokens as oauthAccessTokens,
    oauth_clients as oauthClients
} from 'models';
import { TIMESTAMP, ACCESS_DENIED } from 'utils/constants';
import { strippedUUID } from 'utils';
import { unauthorized } from 'utils/responseInterceptors';
import { getMetaDataByOAuthClientId } from 'daos/oauthClientsDao';
import { convertDbResponseToRawResponse } from 'utils/transformerUtils';

const ttl = server.app.options.oauth.access_token_ttl;
const BEARER = 'Bearer';

export const createAccessToken = async (oauthClientId, timeToLive) => {
    timeToLive = timeToLive || ttl;
    const metadata = await getMetaDataByOAuthClientId(oauthClientId).catch(
        error => error
    );

    if (isEmpty(metadata)) {
        throw unauthorized(ACCESS_DENIED);
    }

    return oauthAccessTokens
        .create({
            accessToken: strippedUUID(),
            oauthClientId,
            expiresIn: timeToLive,
            expiresOn: moment()
                .add(timeToLive, 'seconds')
                .format(TIMESTAMP),
            tokenType: BEARER,
            metadata: JSON.stringify(metadata),
            createdAt: moment()
        })
        .then(accessToken => convertDbResponseToRawResponse(accessToken));
};

/**
 * Find access token
 * @date 2020-03-21
 * @param {any} accessToken
 * @returns {any}
 */
export const findAccessToken = accessToken => {
    const where = {};

    return oauthAccessTokens
        .findOne({
            attributes: [
                'accessToken',
                'metadata',
                'expiresIn',
                'expiresOn',
                'oauthClientId'
            ],
            where: {
                accessToken,
                expiresOn: {
                    [Op.gt]: moment().format(TIMESTAMP)
                }
            },
            include: [
                {
                    model: oauthClients,
                    where
                }
            ],
            underscoredAll: false
        })
        .then(token => {
            if (token) {
                return convertDbResponseToRawResponse(token);
            }
            return token;
        });
};

export const updateAccessToken = (accessToken, ttl) =>
    oauthAccessTokens.update(
        {
            accessToken,
            expiresIn: ttl,
            expiresOn: moment()
                .add(ttl, 'seconds')
                .format(TIMESTAMP)
        },
        {
            where: {
                accessToken
            },
            underscoredAll: false
        }
    );
