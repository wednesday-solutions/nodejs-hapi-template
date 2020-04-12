import { findOneUser } from 'daos/userDao';
import { notFound } from 'utils/responseInterceptors';
module.exports = [
    {
        method: 'GET',
        path: '/{userId}',
        options: {
            cors: true,
            plugins: {
                'hapi-rate-limit': {
                    userPathLimit: 5,
                    expiresIn: 60000
                }
            }
        },
        handler: async request => {
            const userId = request.params.userId;
            const user = await findOneUser(userId);
            if (!user) {
                return notFound(`No user was found for id:${userId}`);
            }
            return { user };
        }
    }
];
