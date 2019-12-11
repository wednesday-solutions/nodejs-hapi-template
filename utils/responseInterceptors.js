import Boom from '@hapi/boom';

export const badRequest = message => {
    throw Boom.badRequest(`${message}`);
};

export const notFound = message => {
    throw Boom.notFound(`${message}`);
};

export const unauthorized = message => {
    throw Boom.unauthorized(`${message}`);
};

export const badImplementation = message => {
    throw Boom.badImplementation(`${message}`);
};
