import mapKeysDeep from 'map-keys-deep';
import { snakeCase, camelCase } from 'lodash';
import { redisCache } from '@utils/cacheConstants';

require('@babel/register');

const Hapi = require('@hapi/hapi');
const path = require('path');
const loadRoutes = require('@plugins/loadRoutes').default;

exports.init = async () => {
  const server = Hapi.server({
    port: 9000,
    host: 'localhost',
    cache: [redisCache],
  });
  await loadRoutes.register(server, {
    routes: '**/routes.js',
    cwd: path.join(__dirname, 'routes'),
    log: false,
    ignore: '**/routes.test.js',
  });
  const onPreHandler = function (request, h) {
    const requestQueryParams = request.query;
    const requestPayload = request.payload;
    request.query = mapKeysDeep(requestQueryParams, (keys) => camelCase(keys));
    request.payload = mapKeysDeep(requestPayload, (keys) => camelCase(keys));
    return h.continue;
  };

  const onPreResponse = function (request, h) {
    const { response } = request;
    const responseSource = response.source;
    response.source = mapKeysDeep(responseSource, (keys) => snakeCase(keys));
    return h.continue;
  };

  server.ext('onPreHandler', onPreHandler);
  server.ext('onPreResponse', onPreResponse);
  return server;
};
