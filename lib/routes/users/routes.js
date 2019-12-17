// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
import { users } from 'models';
import { notFound } from 'utils/responseInterceptors';
module.exports = [
    {
        method: 'GET',
        path: '/{userId}',
        handler: async request => {
            const userId = request.params.userId;
            const user = await users.findByPk(userId);
            if (!user) {
                notFound(`No user was found for id:${userId}`);
            }
            return { user };
        }
    }
];
