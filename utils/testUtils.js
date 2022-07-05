import { users } from 'models';
import { init } from '../lib/testServer';
import { mockData } from './mockData';
import { DEFAULT_METADATA_OPTIONS } from './constants';

export function configDB(metadataOptions = DEFAULT_METADATA_OPTIONS) {
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

export async function mockDB(
    mockCallback = () => {},
    metadataOptions = DEFAULT_METADATA_OPTIONS
) {
    jest.doMock('models', () => {
        const sequelizeData = configDB(metadataOptions);

        if (mockCallback) {
            mockCallback(sequelizeData);
        }
        return sequelizeData;
    });
}

export const resetAndMockDB = async (
    mockDBCallback = () => {},
    metadataOptions = DEFAULT_METADATA_OPTIONS
) => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
    mockDB(mockDBCallback, metadataOptions);
    const server = await init();
    return server;
};
