import { users } from 'models';
import { init } from '../lib/testServer';

export const mockData = {
    MOCK_USER: {
        id: 1,
        firstName: 'Sharan',
        lastName: 'Salian',
        email: 'sharan@wednesday.is'
    }
};

export function configDB() {
    const SequelizeMock = require('sequelize-mock');
    const DBConnectionMock = new SequelizeMock();
    const userMock = DBConnectionMock.define('users', mockData.MOCK_USER);
    userMock.findByPk = query => userMock.findById(query);
    userMock.count = () => 1;
    return {
        users: userMock
    };
}

export function bustDB() {
    users.sync({ force: true }); // this will clear all the entries in your table.
}

export async function mockDB(mockCallback = () => {}) {
    jest.doMock('models', () => {
        const sequelizeData = configDB();
        if (mockCallback) {
            mockCallback(sequelizeData);
        }
        return sequelizeData;
    });
}

export const resetAndMockDB = async mockDBCallback => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
    mockDB(mockDBCallback);
    const server = await init();
    return server;
};
