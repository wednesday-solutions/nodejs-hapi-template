import { resetAndMockDB } from 'utils/testUtils';

describe('/signup route tests', () => {
    let server;
    it('should return 200 status code if valid credentials are provided', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.users.$queryInterface.$useHandler(function (query) {
                if (query === 'findOne') {
                    return null;
                }
            });
        });
        const res = await server.inject({
            method: 'POST',
            url: '/api/signup',
            payload: {
                name: 'Mohit',
                email: 'mohit@test.com',
                password: '12345678A'
            }
        });

        expect(res.statusCode).toEqual(200);
    });
    it('should return 400 status code if invalid credentials are provided', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.users.$queryInterface.$useHandler(function (query) {
                if (query === 'findOne') {
                    return {
                        name: 'Mohit',
                        email: 'mohit@test.com',
                        password: '12345678A'
                    };
                }
            });
        });
        const res = await server.inject({
            method: 'POST',
            url: '/api/signup',
            payload: {
                name: 'Dorian',
                email: 'mohit@test.com',
                password: '12345678AA'
            }
        });

        expect(res.statusCode).toEqual(400);
    });
});
