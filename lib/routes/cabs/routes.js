module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: async request => ({ cabs: [] }),
        options: {
            description: 'get nearby cabs for the user',
            notes: 'GET cabs API',
            tags: ['api', 'cabs'],
            auth: false
        }
    }
];
