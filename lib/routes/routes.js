const { logger } = require('utils');

// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            const message = 'Health check up and running!';
            logger().info(message);
            return h.response('Hapi template at your service');
        },
        options: {
            auth: false,
            tags: ['api', 'health-check']
        }
    }
];
