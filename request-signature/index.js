'use strict';

const Boom = require('@hapi/boom');
const Hoek = require('@hapi/hoek');
const Joi = require('@hapi/joi');

// Declare Internals
const internals = {};

internals.schema = Joi.object().keys({
    validate: Joi.func().required()
});

internals.implementation = (server, options) => {
    const scheme = {
        authenticate: async (request, h) => {
            console.log({ request });
            console.log({ h });
        }
    };

    return scheme;
};

exports.plugin = {
    name: 'request-signature',
    version: '1.0.0',
    register: (server, options) =>
        server.auth.scheme('request-signature', internals.implementation)
};
