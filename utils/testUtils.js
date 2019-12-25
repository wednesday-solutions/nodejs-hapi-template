import { users } from 'models';
export function mockDB() {
    jest.doMock('models', () => {
        const SequelizeMock = require('sequelize-mock');
        const DBConnectionMock = new SequelizeMock();
        const userMock = DBConnectionMock.define('users', {
            id: 1,
            firstName: 'Sharan',
            lastName: 'Salian',
            email: 'sharan@wednesday.is',
            created_at: new Date(),
            updated_at: new Date()
        });
        userMock.findByPk = query => userMock.findById(query);
        return {
            users: userMock
        };
    });
}

export function bustDB() {
    users.sync({ force: true }); // this will clear all the entries in your table.
}
