export const findOneUser = userId => {
    const {
        /* eslint-disable global-require */
        users
    } = require('models');
    return users.findOne({
        attributes: ['id', 'first_name', 'last_name', 'email'],
        where: {
            id: userId
        },
        underscoredAll: false
    });
};
