import Hapi from '@hapi/hapi';
import path from 'path';
import cluster from 'cluster';
import os from 'os';
import { camelCase, snakeCase } from 'lodash';
import authBearer from 'hapi-auth-bearer-token';
import authConfig from '@config/auth';
import mapKeysDeep from 'map-keys-deep';
import hapiPagination from 'hapi-pagination';
import hapiSwaggerUI from 'hapi-swaggerui';
import inert from '@hapi/inert';
import vision from '@hapi/vision';
import rateLimiter from 'hapi-rate-limit';
import rTracer from 'cls-rtracer';

import cors from 'hapi-cors';
import serverConfig from '@config/server';
import dbConfig from '@config/db';
import hapiPaginationOptions from '@utils/paginationConstants';
import { models } from '@models';
import { isLocalEnv, isTestEnv, logger } from '@utils';
import cachedUser from '@utils/cacheMethods';
import loadRoutes from '@plugins/loadRoutes';
import Pack from './package.json';

const totalCPUs = os.cpus().length;

const prepDatabase = async () => {
  await models.sequelize
    .authenticate()
    .then(() => {
      // eslint-disable-next-line no-console
      logger().info('Connection has been established successfully.');
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      logger().error('Unable to connect to the database:', err);
    });
};

// eslint-disable-next-line import/prefer-default-export, import/no-mutable-exports
export let server;

const initServer = async () => {
  // eslint-disable-next-line global-require
  require('@utils/configureEnv');
  server = Hapi.server(serverConfig);

  // Register hapi swagger plugin
  await server.register([
    inert,
    vision,
    {
      plugin: hapiSwaggerUI,
      options: {
        documentationPage: true,
        swaggerUI: true,
        auth: false,
        templates: path.join(
          __dirname,
          '../node_modules/hapi-swaggerui/templates'
        ),
        info: {
          title: 'Node Hapi Template API documentation',
          version: Pack.version,
        },
        grouping: 'tags',
        tags: [
          {
            name: 'health-check',
            description: 'Health check endpoint',
          },
          {
            name: 'users',
            description: 'User related endpoints',
          },
          {
            name: 'oauth2-resources',
            description: 'Oauth2 resources related endpoints',
          },
          {
            name: 'oauth2-scopes',
            description: 'Oauth2 scopes related endpoints',
          },
          {
            name: 'oauth2-clients',
            description: 'Oauth2 clients related endpoints',
          },
          {
            name: 'oauth2-tokens',
            description: 'Oauth2 tokens related endpoints',
          },
          {
            name: 'reset-cache',
            description: 'Cache invalidation endpoints',
          },
        ],
      },
    },
  ]);

  await server.register({
    plugin: rTracer.hapiPlugin,
  });

  // Register pagignation plugin
  await server.register({
    plugin: hapiPagination,
    options: hapiPaginationOptions,
  });

  // register auth plugin
  await server.register({
    plugin: authBearer
  });
  server.auth.strategy('bearer', 'bearer-access-token', authConfig);
  server.auth.default('bearer');

  // Register Wurst plugin
  await loadRoutes.register(server, {
    routes: '**/routes.js',
    cwd: path.join(__dirname, '../lib/routes'),
    log: true,
    ignore: '**/routes.test.js',
  });

  await cachedUser(server);

  // Register cors plugin
  await server.register({
    plugin: cors,
    options: {
      origins: ['http://localhost:3000'],
    },
  });

  // Register rate limiter plugin
  await server.register({
    plugin: rateLimiter,
  });

  await server.start();

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
    // hack for hapi-swagger
    if (!["/documentation", "/swaggerui/"].map(p => p.includes(request.path))) { 
      response.source = mapKeysDeep(responseSource, (keys) => snakeCase(keys));
      if (response.header) {
        const requestId = rTracer.id();
        response.header('x-request-id', requestId);
        logger().info('API Success: ', response.source);
      }
    }
    

    return h.continue;
  };

  const onRequest = (request, h) => {
    const { path: requestPath } = request;
    const { info } = request;
    const { query } = request;

    const requestDetails = {
      path: requestPath,
      info,
      query,
    };

    logger().info('Request Recieved: ', requestDetails);
    return h.continue;
  };

  server.ext('onRequest', onRequest);
  server.ext('onPreHandler', onPreHandler);
  server.ext('onPreResponse', onPreResponse);

  // eslint-disable-next-line no-console
  logger().info('Server running on: ', server.info.uri);


  server.events.on('request', (_, error) => {
    if (error) {
      logger().info('API Failure: ', { error });
      // eslint-disable-next-line no-console
      logger().info(error);
    }
  });

  return true;
};

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  logger().info(err);
  process.exit(1);
});
if (!isTestEnv() && !isLocalEnv() && cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {
  prepDatabase().then(
    () => {
      // eslint-disable-next-line no-console
      logger().info(`Database connection to ${dbConfig.url} is successful.\n`);
      // eslint-disable-next-line no-console
      logger().info('Initializing the server...');

      return initServer();
    },
    (error) => {
      // eslint-disable-next-line no-console
      logger().error(error, 'Server startup failed...');
    }
  );

}
