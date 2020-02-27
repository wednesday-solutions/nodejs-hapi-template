import { users } from 'models';
export const findUser = userId =>
    users.findOne({
        attributes: ['id', 'first_name', 'last_name', 'email'],
        where: {
            id: userId
        },
        underscoredAll: false
    });

export const findUserByPk = userId => users.findByPk(userId, { raw: true });

export const createUser = user => users.create(user);

export const updateUser = (id, user) => users.update(user, { where: { id } });

export const deleteUser = id => {
    users.destroy({ where: { id } });
    return 'Success data with id: ' + `${id}`;
};
