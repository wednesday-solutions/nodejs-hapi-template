/* global server */
import { init } from './lib/testServer';

beforeEach(async () => {
    global.server = await init();
    jest.resetModules();
});
afterAll(async () => {
    await server.stop();
});
