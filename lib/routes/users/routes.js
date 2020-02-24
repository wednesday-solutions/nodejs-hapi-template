// Note: Unfortunately, wurst does not work well with the ES6 default export syntax.
import { createUser, updateUser, findUser, deleteUser } from 'daos/userDao';

import { users } from 'models';
import { notFound, badRequest } from 'utils/responseInterceptors';
import Joi from '@hapi/joi';
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
            return createUser(user)
                .then(user => user)
                .catch(error => error);
        },
        options: {
            auth: false,
            validate: {
                payload: {
                    first_name: Joi.string()
                        .min(1)
                        .max(20),
                    last_name: Joi.string()
                        .min(1)
                        .max(20),
                    email: Joi.string().min(7)
                }
            }
        }
    },
    {
        method: 'PUT',
        path: '/{userId}',
        handler: request => {
            const userId = request.params.userId;
            const user = request.payload;
            return updateUser(userId, user)
                .then(() => findUser(userId).then(user => user))
                .catch(err => badRequest(err.message));
        },
        options: {
            auth: false,
            validate: {
                payload: {
                    first_name: Joi.string()
                        .min(1)
                        .max(20),
                    last_name: Joi.string()
                        .min(1)
                        .max(20),
                    email: Joi.string().min(7)
                }
            }
        }
    },
    {
        method: 'PATCH',
        path: '/{userId}',
        handler: request => {
            const userId = request.params.userId;
            const user = request.payload;
            return updateUser(userId, user)
                .then(() => findUser(userId).then(user => user))
                .catch(err => badRequest(err.message));
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
