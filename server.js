import Hapi from '@hapi/hapi';
import path from 'path';
import wurst from 'wurst';
import { camelCase, snakeCase } from 'lodash';
import authBearer from 'hapi-auth-bearer-token';
import authConfig from 'config/auth';
import mapKeysDeep from 'map-keys-deep';
import hapiPagination from 'hapi-pagination';
import hapiSwaggerUI from 'hapi-swaggerui';
import inert from '@hapi/inert';
import vision from '@hapi/vision';
import Pack from './package.json';
import rateLimiter from 'hapi-rate-limit';

import cors from 'hapi-cors';
import serverConfig from 'config/server';
import dbConfig from 'config/db';
import hapiPaginationOptions from 'utils/paginationConstants';
import models from 'models';
import { cachedUser } from 'utils/cacheMethods';

const prepDatabase = async () => {
    await models.sequelize
        .authenticate()
        .then(() => {
            // eslint-disable-next-line no-console
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            // eslint-disable-next-line no-console
            console.error('Unable to connect to the database:', err);
        });
};

export let server;

const initServer = async () => {
    server = Hapi.server(serverConfig);

    // Register hapi swagger plugin
    await server.register([
        inert,
        vision,
        {
            plugin: hapiSwaggerUI,
            swaggerOptions: {
                documentationPage: true,
                swaggerUI: true,
                auth: false,
                authorization: null,
                info: {
                    title: 'Node Hapi Template API documentation',
                    version: Pack.version
                }
            },
            options: {
                grouping: 'tags',
                tags: [
                    {
                        name: 'health-check',
                        description: 'Health check endpoint'
                    },
                    {
                        name: 'users',
                        description: 'User related endpoints'
                    },
                    {
                        name: 'oauth2-resources',
                        description: 'Oauth2 resources related endpoints'
                    },
                    {
                        name: 'oauth2-scopes',
                        description: 'Oauth2 scopes related endpoints'
                    },
                    {
                        name: 'oauth2-clients',
                        description: 'Oauth2 clients related endpoints'
                    },
                    {
                        name: 'oauth2-tokens',
                        description: 'Oauth2 tokens related endpoints'
                    },
                    {
                        name: 'reset-cache',
                        description: 'Cache invalidation endpoints'
                    }
                ]
            }
        }
    ]);

    // Register pagignation plugin
    await server.register({
        plugin: hapiPagination,
        options: hapiPaginationOptions
    });

    // register auth plugin
    await server.register({
        plugin: authBearer
    });
    server.auth.strategy('bearer', 'bearer-access-token', authConfig);
    server.auth.default('bearer');

    // Register Wurst plugin
    await server.register({
        plugin: wurst,
        options: {
            routes: '**/routes.js',
            cwd: path.join(__dirname, 'lib/routes'),
            log: true
        }
    });

    await cachedUser(server);

    // Register cors plugin
    await server.register({
        plugin: cors,
        options: {
            origins: ['http://localhost:3000']
        }
    });

    // Register rate limiter plugin
    await server.register({
        plugin: rateLimiter
    });

    await server.start();

    const onPreHandler = function(request, h) {
        const requestQueryParams = request.query;
        const requestPayload = request.payload;
        request.query = mapKeysDeep(requestQueryParams, keys =>
            camelCase(keys)
        );
        request.payload = mapKeysDeep(requestPayload, keys => camelCase(keys));
        return h.continue;
    };

    const onPreResponse = function(request, h) {
        const response = request.response;
        const responseSource = response.source;
        response.source = mapKeysDeep(responseSource, keys => snakeCase(keys));
        return h.continue;
    };

    server.ext('onPreHandler', onPreHandler);
    server.ext('onPreResponse', onPreResponse);

    // eslint-disable-next-line no-console
    console.log('Server running on %s', server.info.uri);

    return true;
};

process.on('unhandledRejection', err => {
    // eslint-disable-next-line no-console
    console.log(err);
    process.exit(1);
});

prepDatabase().then(
    () => {
        // eslint-disable-next-line no-console
        console.log(
            `Database connection to ${
                dbConfig.development.url
            } is successful.\nThe following options were applied: ${JSON.stringify(
                dbConfig.development
            )}`
        );
        // eslint-disable-next-line no-console
        console.log(`Initializing the server...`);

        return initServer();
    },
    error => {
        // eslint-disable-next-line no-console
        console.error(error, `Server startup failed...`);
    }
);
