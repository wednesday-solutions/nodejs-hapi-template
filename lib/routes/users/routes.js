import get from 'lodash/get';
import { notFound, badImplementation } from '@utils/responseInterceptors';
import { server } from '@root/server.js';
import { findAllUser } from '@daos/userDao';
import { transformDbArrayResponseToRawResponse } from '@utils/transformerUtils';

export default [
  {
    method: 'GET',
    path: '/{userId}',
    options: {
      description: 'get one user by ID',
      notes: 'GET users API',
      tags: ['api', 'users'],
      cors: true,
    },
    handler: async (request) => {
      const { userId } = request.params;
      return server.methods.findOneUser(userId).then((user) => {
        if (!user) {
          return notFound(`No user was found for id ${userId}`);
        }
        return user;
      });
    },
  },
  {
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      const { page, limit } = request.query;
      return findAllUser(page, limit)
        .then((users) => {
          if (get(users.allUsers, 'length')) {
            const { totalCount } = users;
            const allUsers = transformDbArrayResponseToRawResponse(
              users.allUsers,
            ).map((user) => user);

            return h.response({
              results: allUsers,
              totalCount,
            });
          }
          return notFound('No users found');
        })
        .catch((error) => badImplementation(error.message));
    },
    options: {
      description: 'get all users',
      notes: 'GET users API',
      tags: ['api', 'users'],
      plugins: {
        pagination: {
          enabled: true,
        },
        query: {
          pagination: true,
        },
      },
    },
  },
];
