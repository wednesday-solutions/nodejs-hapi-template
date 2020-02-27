import Boom from '@hapi/boom';

export const notFound = message => Boom.notFound(message);

// export const badRequest = message => Boom.badRequest(message);

// export const unauthorized = message => Boom.unauthorized(message);

// export const badImplementation = message => Boom.badImplementation(message);
