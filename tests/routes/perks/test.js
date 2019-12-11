/* global server */
import { mockDB } from 'utils/testUtils';

describe('as', () => {
    beforeAll(() => {
        mockDB();
    });

    it('should return 200', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/v1.0/perks/1'
        });
        expect(res.statusCode).toEqual(200);
    });
});
