import isEmpty from 'lodash/isEmpty';
import guardAndGet from './env';

/**
 *
 * @param {*} route
 * @returns {*} route configuration with cors options
 *
 * @example
 *
 * withCORS({
 *   method: 'GET',
 *   path: '/user',
 *   handler: (){...},
 *   options: {
 *   ...,
 *   cors: {
 *     origin: ['https://example.com']
 *     }
 *   }
 * })
 *
 * Use options.cors to add more CORS options
 * @link
 * https://hapi.dev/api/?v=20.2.2#-routeoptionscors
 *
 */
const withCORS = (route) => {
  if (!route || isEmpty(route) || typeof route !== 'object') {
    throw new Error('Invalid route config');
  }

  /**
   * @description Add the origins that are to be whitelisted for each environment.
   *
   */
  const ALLOWED_ORIGINS = {
    local: ['http://localhost:3000'],
    development: [],
    production: [],
    get getForEnvironment() {
      return this[guardAndGet.ENVIRONMENT_NAME];
    },
  };

  const { options = {} } = route;
  const { cors = {} } = options;

  return {
    ...route,
    options: {
      ...options,
      /**
       *
       * @default maxAge = 86400 // 1 day
       * @default headers = ['Accept', 'Authorization', 'Content-Type', 'If-None-Match']
       * @default exposedHeaders = ['WWW-Authenticate', 'Server-Authorization']
       *
       *
       * @description Define cors rules for a route
       */
      cors: {
        origin: ALLOWED_ORIGINS.getForEnvironment,
        ...cors,
      },
    },
  };
};

export default withCORS;
