/* global server */
import { mockDB } from 'utils/testUtils';

describe('as', () => {
    beforeAll(() => {
        mockDB();
    });
    it('should return 200', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/users/1'
        });
        expect(res.statusCode).toEqual(200);
    });
    it('should return 200', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/users'
        });
        expect(res.statusCode).toEqual(200);
    });
    it('should return 200', async () => {
        const res = await server.inject({
            method: 'DELETE',
            url: '/users/1'
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 200', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/users/1'
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 200', async () => {
        const res = await server.inject({
            method: 'PATCH',
            url: '/users/1'
        });
        expect(res.statusCode).toEqual(200);
    });
});
