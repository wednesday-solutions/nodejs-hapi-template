import { users } from 'models';

const attributes = ['id', 'name', 'email', 'password'];

export const findOneUser = async userId =>
    users.findOne({
        attributes,
        where: {
            id: userId
        }
    });

export const findUserByEmail = async email =>
    users.findOne({
        attributes,
        where: {
            email
        }
    });

export const findAllUser = async (page, limit) => {
    const where = {};
    const totalCount = await users.count({ where });
    const allUsers = await users.findAll({
        attributes,
        where,
        offset: (page - 1) * limit,
        limit
    });
    return { allUsers, totalCount };
};
