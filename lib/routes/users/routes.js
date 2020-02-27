// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
import {
    createUser,
    updateUser,
    findUser,
    deleteUser,
    findUserByPk
} from 'daos/userDao';

import { notFound } from 'utils/responseInterceptors';
module.exports = [
    {
        method: 'GET',
        path: '/{userId}',
        handler: async request => {
            const userId = request.params.userId;
            const user = await findUserByPk(userId);
            if (!user) {
                return notFound('User does not exist');
            }
            return user;
        }
    },
    {
        method: 'POST',
        path: '/',
        handler: async request => {
            const user = request.payload;
            const userDetails = createUser(user)
                .then(user => user)
                .catch(err => err);

            return userDetails;
        }
    },
    {
        method: 'PUT',
        path: '/{userId}',
        handler: request => {
            const userId = request.params.userId;
            const user = request.payload;
            return updateUser(userId, user)
                .then(() => findUser(userId))
                .catch(err => err);
        }
    },
    {
        method: 'PATCH',
        path: '/{userId}',
        handler: request => {
            const userId = request.params.userId;
            const user = request.payload;
            return updateUser(userId, user)
                .then(() => findUserByPk(userId))
                .catch(err => err);
        }
    },
    {
        method: 'DELETE',
        path: '/{userId}',
        handler: request => {
            const userId = request.params.userId;
            return deleteUser(userId);
        }
    }
];
