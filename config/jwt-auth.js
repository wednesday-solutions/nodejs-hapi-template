import { findOneUser } from 'daos/userDao';

export default {
    key: process.env.JWT_SECRET,
    validate: async (decoded, request, h) => {
        const user = await findOneUser(decoded.id);
        if (user) {
            return { isValid: true };
        }
        return { isValid: false };
    },
    verifyOptions: {
        ignoreExpiration: true
    }
};
