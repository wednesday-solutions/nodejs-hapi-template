import { resetAndMockDB } from 'utils/testUtils';
import { mockData } from 'utils/mockData';

const { MOCK_USER: user } = mockData;

describe('/user route tests ', () => {
    let server;
    beforeEach(async () => {
        server = await resetAndMockDB();
    });
    it('should return 200', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/users/4',
            auth: {
                credentials: 'bearer',
                strategy: 'jwt'
            }
        });
        expect(res.statusCode).toEqual(200);
    });

    it('should return 404', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/users/2',
            auth: {
                credentials: 'bearer',
                strategy: 'jwt'
            }
        });
        expect(res.statusCode).toEqual(404);
        expect(res.result.message).toEqual('No user was found for id 2');
    });

    it('should return 401', async () => {
        const res = await server.inject({
            method: 'GET',
            url: '/users/4'
        });
        expect(res.statusCode).toEqual(401);
        expect(res.result.message).toEqual('Missing authentication');
    });
    it('should return all the users ', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.users.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return user;
                }
            });
        });
        const res = await server.inject({
            method: 'GET',
            url: '/users'
        });

        expect(res.statusCode).toEqual(200);
        const userOne = res.result.results[0];
        expect(userOne.id).toEqual(user.id);
        expect(userOne.name).toEqual(user.name);
        expect(userOne.email).toEqual(user.email);
        expect(res.result.total_count).toEqual(1);
    });

    it('should return notFound if no users are found', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.users.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return null;
                }
            });
            allDbs.users.findAll = () => null;
        });
        const res = await server.inject({
            method: 'GET',
            url: '/users'
        });
        expect(res.statusCode).toEqual(404);
    });

    it('should return badImplementation if findAllUsers fails', async () => {
        server = await resetAndMockDB(async allDbs => {
            allDbs.users.$queryInterface.$useHandler(function (query) {
                if (query === 'findById') {
                    return null;
                }
            });
            allDbs.users.findAll = () =>
                new Promise((resolve, reject) => {
                    reject(new Error());
                });
        });
        const res = await server.inject({
            method: 'GET',
            url: '/users'
        });
        expect(res.statusCode).toEqual(500);
    });
});
