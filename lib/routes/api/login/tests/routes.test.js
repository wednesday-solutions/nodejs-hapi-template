import { resetAndMockDB } from 'utils/testUtils';
describe('/login route tests', () => {
    let server;
    beforeEach(async () => {
        server = await resetAndMockDB();
    });

    it('should return 200 status code incase of correct email and password', async () => {
        const res = await server.inject({
            method: 'POST',
            url: '/api/login',
            payload: {
                email: 'test@test.com',
                password: '123456789'
            }
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 400 status code incase of incorrect password or email', async () => {
        let res = await server.inject({
            method: 'POST',
            url: '/api/login',
            payload: {
                email: 'test@test.com',
                password: '12345'
            }
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Incorrect email or password!');

        server = await resetAndMockDB(async allDbs => {
            allDbs.users.$queryInterface.$useHandler(function (query) {
                if (query === 'findOne') {
                    return null;
                }
            });
        });

        res = await server.inject({
            method: 'POST',
            url: '/api/login',
            payload: {
                email: 'baki@test.com',
                password: '123456'
            }
        });
        expect(res.statusCode).toEqual(400);
        expect(res.result.message).toEqual('Incorrect email or password!');
    });
});
