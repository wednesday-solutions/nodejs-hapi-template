/* global server */
import { init } from './lib/testServer';
import { mockDB } from 'utils/testUtils';

mockDB();
beforeEach(async () => {
    global.server = await init();
    jest.resetModules();
});
afterAll(async () => {
    await server.stop();
});
