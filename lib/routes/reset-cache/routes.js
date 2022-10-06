import { server } from '@root/server.js';
import { badRequest } from '@hapi/boom';

export default [
  {
    method: 'DELETE',
    path: '/users/{userId}',
    handler: (request) => {
      const { userId } = request.params;
      return server.methods.findOneUser.cache
        .drop(userId)
        .then(() => 'Cache Dropped Successfully')
        .catch((error) => {
          request.log('error', error);
          return badRequest(error.message);
        });
    },
    options: {
      description: 'resetting cache for users',
      notes: 'DELETE user cache API',
      tags: ['api', 'reset-cache'],
    },
  },
];
