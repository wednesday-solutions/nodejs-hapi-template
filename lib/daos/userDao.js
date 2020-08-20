import { users } from 'models';

const attributes = [
    'id',
    'first_name',
    'last_name',
    'email',
    'oauth_client_id'
];

export const findOneUser = async userId =>
    users.findOne({
        attributes,
        where: {
            id: userId
        },
        underscoredAll: false
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
