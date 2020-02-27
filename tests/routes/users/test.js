/* global server */
import { mockDB } from 'utils/testUtils';

describe('as', () => {
    beforeAll(() => {
        mockDB();
    });

    it('should return 200 GET', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/users/1'
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 404 GET', async () => {
        mockDB(allDbs => {
            allDbs.users.findByPk = () => null;
        });
        const res = await server.inject({
            method: 'GET',
            url: '/users'
        });
        expect(res.statusCode).toEqual(404);
    });

    it('should return 200 POST', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/users'
        });
        expect(res.statusCode).toEqual(200);
    });
    it('should return 200 DELETE', async () => {
        const res = await server.inject({
            method: 'DELETE',
            url: '/users/1'
        });
        expect(res.statusCode).toEqual(200);
    });
    it('should return 200 PUT', async () => {
        const res = await server.inject({
            method: 'PUT',
            url: '/users/1'
        });
        expect(res.statusCode).toEqual(200);
    });
    it('should return 200 PATCH', async () => {
        const res = await server.inject({
            method: 'PATCH',
            url: '/users/1'
        });
        expect(res.statusCode).toEqual(200);
    });
});
