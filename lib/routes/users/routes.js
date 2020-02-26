import { users } from 'models';
import {
    createOneUser,
    findOneUser,
    deleteOneUser,
    updateOneUser
} from 'daos/userDao';
import { notFound } from 'utils/responseInterceptors';

module.exports = [
    {
        method: 'GET',
        path: '/{userId}',
        handler: async request => {
            const userId = request.params.userId;
            const user = await users.findByPk(userId);
            if (!user) {
                return notFound(`No user was found for id:${userId}`);
            }
            return { user };
        }
    },

    {
        method: 'POST',
        path: '/',
        handler: async request => {
            const user = request.payload;
            return createOneUser(user)
                .then(user => user)
                .catch(err => console.error(err));
        }
    },

    {
        method: 'DELETE',
        path: '/{userId}',
        handler: request => {
            const userId = request.params.userId;
            const deletedUser =
                'User deleted successfully with user id : ' + `${userId}`;
            return deleteOneUser(userId)
                .then(() => deletedUser)
                .catch(error => error.message);
        }
    },

    {
        method: 'PUT',
        path: '/{userId}',
        handler: async request => {
            const user = request.payload;
            const userId = request.params.userId;
            return updateOneUser(userId, user)
                .then(() => findOneUser(userId))
                .catch(error => error);
        }
    },

    {
        method: 'PATCH',
        path: '/{userId}',
        handler: async request => {
            const user = request.payload;
            const userId = request.params.userId;
            return updateOneUser(userId, user)
                .then(() => findOneUser(userId))
                .catch(error => error);
        }
    }
];
