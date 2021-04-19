import { createOneCar } from 'daos/carDao';
import { badRequest } from 'utils/responseInterceptors';
import Joi from '@hapi/joi';

module.exports = [
    {
        method: 'POST',
        path: '/',
        options: {
            description: 'crate a car',
            notes: 'Create cars API',
            tags: ['api', 'cars'],
            cors: true,
            validate: {
                payload: Joi.object({
                    model: Joi.string().required(),
                    status: Joi.string().optional(),
                    registrationNo: Joi.string().required(),
                    location: Joi.array(),
                    type: Joi.string()
                })
            }
        },
        handler: async request => {
            try {
                const {
                    model,
                    status,
                    registrationNo,
                    location,
                    type
                } = request.payload;

                const newCar = await createOneCar({
                    model,
                    status,
                    registrationNo,
                    location,
                    type
                });

                return {
                    ok: true,
                    data: newCar
                };
            } catch (error) {
                badRequest(error.message);
            }
        }
    },
    {
        method: 'GET',
        path: '/{carId}',
        options: {
            description: 'get one car by ID',
            notes: 'GET cars API',
            tags: ['api', 'cars'],
            cors: true
        },
        handler: async request => {
            // const carId = request.params.carId;
        }
    },
    {
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            // const { page, limit } = request.query;
        },
        options: {
            description: 'get all cars',
            notes: 'GET cars API',
            tags: ['api', 'cars'],
            plugins: {
                pagination: {
                    enabled: true
                },
                query: {
                    pagination: true
                }
            }
        }
    }
];
