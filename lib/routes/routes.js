const { logger } = require('@utils');

// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
export default [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      const message = 'Health check up and running!';
      logger().info(message);
      return h.response({ data: 'Hapi template at your service' });
    },
    options: {
      description: 'this is the health check api',
      auth: false,
      tags: ['api', 'health-check'],
    },
  },
];
