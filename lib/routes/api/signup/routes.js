import { emailSchema, stringSchema, Joi } from 'utils/validationUtils';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from 'daos/userDao';
import { badRequest } from 'utils/responseInterceptors';
import { users } from 'models';

const verifyUniqueUser = async (request, h) => {
    const user = await findUserByEmail(request.payload.email);
    if (user) {
        return badRequest('Account with email already exist');
    } else {
        return h.response(request.payload);
    }
};

module.exports = [
    {
        method: 'POST',
        path: '/',
        options: {
            description: 'user signup',
            notes: 'API to create a user',
            tags: ['api', 'cab user signup'],
            cors: true,
            auth: false,
            pre: [{ method: verifyUniqueUser }],
            validate: {
                payload: Joi.object({
                    name: stringSchema,
                    email: emailSchema,
                    password: Joi.string().min(8).max(20).required()
                })
            }
        },
        handler: async function (request, h) {
            let user = {};
            user.name = request.payload.name;
            user.email = request.payload.email;
            user.oauthClientId = 1;
            try {
                user.password = await bcrypt.hash(request.payload.password, 10);

                const res = await users.create(user);
                const token = jwt.sign(
                    { id: res.id, ...request.payload },
                    process.env.JWT_SECRET
                );

                return { token, res };
            } catch (error) {
                throw badRequest(error);
            }
        }
    }
];
