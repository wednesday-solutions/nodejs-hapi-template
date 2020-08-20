import { users, oauth_clients as oauthClients } from 'models';

const attributes = ['id', 'first_name', 'last_name', 'email'];

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

export const findUserById = async id => {
    try {
        users.hasOne(oauthClients, { foreignKey: 'id' });
        return users.findOne({
            attributes: [...attributes, 'oauth_client_id'],
            where: {
                id
            },
            include: [
                {
                    model: oauthClients
                }
            ]
        });
    } catch {
        return null;
    }
};
