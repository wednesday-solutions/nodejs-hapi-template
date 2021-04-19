
module.exports = [
  {
    method: 'POST',
    path: '/',
    options: {
        description: 'crate a car',
        notes: 'Create cars API',
        tags: ['api', 'cars'],
        cors: true
    },
    handler: async request => {
    }
  },
    {
        method: 'GET',
        path: '/{carId}',
        options: {
            description: 'get one car by ID',
            notes: 'GET cars API',
            tags: ['api', 'cars'],
            cors: true
        },
        handler: async request => {
            const carId = request.params.carId;
            
        }
    },
    {
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            const { page, limit } = request.query;
            
        },
        options: {
            description: 'get all cars',
            notes: 'GET cars API',
            tags: ['api', 'cars'],
            plugins: {
                pagination: {
                    enabled: true
                },
                query: {
                    pagination: true
                }
            }
        }
    }
];
