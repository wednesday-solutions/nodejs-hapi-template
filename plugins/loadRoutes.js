import path from 'path';
import glob from 'glob-promise';
import joi from 'joi';
import pkg from '../package.json';

/**
 * @type {Object}
 *
 * @description
 * Internally used data
 */
const internals = {
  routeList: [],
};

/**
 * @type {Object}
 *
 * @description
 * Store joi schemata
 */
const schemata = {
  options: joi.object({
    routes: joi.string().default('**/*.js'),
    ignore: [joi.string(), joi.array().items(joi.string())],
    cwd: joi.string().default(process.cwd()),
    log: joi.boolean().default(false),
  }),
};

/**
 * @function
 * @public
 *
 * @description
 * Get list of file paths based on passed options
 *
 * @returns {Promise<Array.<?string>>} List of file paths
 */
function getFilePaths() {
  return glob(internals.options.routes, {
    nodir: true,
    cwd: internals.options.cwd,
    ignore: internals.options.ignore,
  });
}

/**
 * @function
 * @public
 *
 * @description
 * Extend the list of prefixed routes
 *
 * @param {string} path The modified route path
 * @param {string} method The concerning HTTP method
 */
function extendRouteList({ path: routePath, method }) {
  internals.routeList.push({ path: routePath, method });
}

/**
 * @function
 * @public
 *
 * @description
 * Log the built list of prefixed routes into console
 */
async function logRouteList() {
  const {logger} = await import("@utils")
  logger().info(`\n${pkg.name} prefixed the following routes`);

  internals.routeList.forEach((route) => {
    logger().info(`[${route.method}]`.padEnd(8), route.path);
  });
}

/**
 * @function
 * @public
 *
 * @description
 * Load file and clear cache
 *
 * @param {string} absPath The absolute file path to be loaded and registered
 */
async function loadRoutesOnce(absPath) {
  // eslint-disable-next-line
  let routes = (await import(`../lib/routes${absPath.split('/lib/routes')[1]}`))
    .default;

  if (!Array.isArray(routes)) {
    routes = Array.of(routes);
  }
  delete require.cache[absPath];
  return routes;
}

/**
 * @function
 * @public
 *
 * @description
 * Prefix the path for each of the passed routes
 *
 * @param {Array.<?Object> | Object} absPath The absolute file path to be loaded and registered
 * @param {string} relPath The releative file path to be loaded and registered
 * @returns {Promise<Array.<?Object>>} The list of routes with prefixed paths
 */
function prefixRoutes(absPath, relPath) {
  return loadRoutesOnce(absPath).then((routes) => {
    const pathTree = relPath.split('/').slice(0, -1);
    if (pathTree.length !== 0 || relPath === 'routes.js') {
      return routes.map((route) => {
        extendRouteList({
          method: route.method,
          path: `/${pathTree.join('/')}${route.path}`.replace(/\/$/, ''),
        });
        return {
          ...route,
          path: `/${pathTree.join('/')}${route.path}`.replace(/\/$/, ''),
        };
      });
    }
    return [];
  });
}

/**
 * @function
 * @public
 *
 * @description
 * Load and register routes
 *
 * @param {string} relPath The releative file path to be loaded and registered
 */
function registerRoutes(relPath) {
  const absPath = path.join(internals.options.cwd, relPath);
  return prefixRoutes(absPath, relPath).then((prefixedRoutes) => {
    if (prefixedRoutes) {
      prefixedRoutes.forEach((route) => {
        try {
          internals.server.route(route);
          // eslint-disable-next-line no-empty
        } catch {}
      });
    }
  });
}

/**
 * @function
 * @public
 *
 * @description
 * Initialize auto-loading and prefixing of routes
 */
async function init(server, options) {
  internals.server = server;
  internals.options = joi.attempt(options, schemata.options, 'Invalid options');

  const filePaths = await getFilePaths();

  Promise.all(filePaths.map(registerRoutes)).then(() => {
    if (internals.options.log) {
      logRouteList();
    }
  });
}

export default {
  register: init,
  pkg,
};
