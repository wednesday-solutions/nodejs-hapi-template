/* global server */
import mockdate from 'mockdate'
mockdate.set(0)
import { mockDB } from '@utils/testUtils';
import { ONE_USER_DATA } from '@utils/constants';
import { init } from './lib/testServer';

require('jest-extended');

mockDB();

beforeEach(async () => {
  global.server = await init();
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
});

beforeAll(() => {
  jest.doMock('@root/server', () => ({
    server: {
      ...server,
      methods: {
        findOneUser: (id) => {
          if (id === '1') {
            return new Promise((resolve) => resolve(ONE_USER_DATA));
          }
          return new Promise((resolve) => resolve(null));
        },
      },
    },
  }));
});

afterAll(async () => {
  await server.stop();
});
