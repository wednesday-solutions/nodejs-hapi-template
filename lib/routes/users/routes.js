import { findOneUser } from 'daos/userDao';
import { notFound } from 'utils/responseInterceptors';
module.exports = [
    {
        method: 'GET',
        path: '/{userId}',
        handler: async request => {
            const userId = request.params.userId;
            const user = await findOneUser(userId);
            if (!user) {
                return notFound(`No user was found for id:${userId}`);
            }
            return { user };
        },
        options: {
            description: 'get one user by ID',
            notes: 'GET users API',
            tags: ['api'],
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
