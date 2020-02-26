import { users } from 'models';
export const findOneUser = userId =>
    users.findOne({
        attributes: ['id', 'first_name', 'last_name', 'email'],
        where: {
            id: userId
        },
        underscoredAll: false
    });
export const createOneUser = user => users.create(user);

export const deleteOneUser = id => users.destroy({ where: { id } });

export const updateOneUser = (id, user) =>
    users.update(user, { where: { id } });
