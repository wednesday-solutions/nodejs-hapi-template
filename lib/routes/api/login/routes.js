import { emailSchema, stringSchema, Joi } from 'utils/validationUtils';
import { findUserByEmail } from 'daos/userDao';
import { badRequest } from 'utils/responseInterceptors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const verifyUserCredentials = async (request, h) => {
    const user = await findUserByEmail(request.payload.email);
    if (user) {
        try {
            const isCorrect = await bcrypt.compare(
                request.payload.password,
                user.password
            );
            if (!isCorrect) {
                throw badRequest('Incorrect email or password!');
            }
        } catch (err) {
            throw badRequest(err);
        }
        return { id: user.id, ...request.payload };
    } else {
        throw badRequest('Incorrect email or password!');
    }
};

module.exports = [
    {
        method: 'POST',
        path: '/',
        options: {
            description: 'user login',
            notes: 'API to login user and generate token',
            tags: ['api', 'cab user login'],
            cors: true,
            auth: false,
            validate: {
                payload: Joi.object({
                    email: emailSchema,
                    password: stringSchema
                })
            },
            pre: [{ method: verifyUserCredentials, assign: 'user' }]
        },
        handler: function (request, h) {
            try {
                const token = jwt.sign(
                    request.pre.user,
                    process.env.JWT_SECRET
                );
                return { token, user: request.pre.user };
            } catch (error) {
                throw badRequest(error);
            }
        }
    }
];
