// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
module.exports = [
    {
        method: 'GET',
        path: '/',
        config: {
            auth: false
        },
        handler: request => request.server.settings.app
    }
];
