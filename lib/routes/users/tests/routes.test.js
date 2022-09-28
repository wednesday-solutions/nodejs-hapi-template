import { resetAndMockDB } from '@utils/testUtils';
import { mockData } from '@utils/mockData';

const { MOCK_USER: user } = mockData;

describe('/user route tests ', () => {
  let server;
  beforeEach(async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.users.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return user;
        }
      });
    });
  });
  it('should return 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/users/1',
    });
    expect(res.statusCode).toEqual(200);
  });

  it('should return 404', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/users/2',
    });
    expect(res.statusCode).toEqual(404);
    expect(res.result.message).toEqual('No user was found for id 2');
  });

  it('should return all the users ', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.users.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return user;
        }
      });
    });
    const res = await server.inject({
      method: 'GET',
      url: '/users',
    });

    expect(res.statusCode).toEqual(200);
    const userOne = res.result.results[0];
    expect(userOne.id).toEqual(user.id);
    expect(userOne.first_name).toEqual(user.firstName);
    expect(userOne.last_name).toEqual(user.lastName);
    expect(userOne.email).toEqual(user.email);
    expect(userOne.oauth_client_id).toEqual(user.oauth_client_id);
    expect(res.result.total_count).toEqual(1);
  });

  it('should return notFound if no users are found', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.users.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return null;
        }
      });
      allDbs.models.users.findAll = () => null;
    });
    const res = await server.inject({
      method: 'GET',
      url: '/users',
    });
    expect(res.statusCode).toEqual(404);
  });

  it('should return badImplementation if findAllUsers fails', async () => {
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.users.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return null;
        }
      });
      // eslint-disable-next-line no-param-reassign
      allDbs.models.users.findAll = () =>
        new Promise((resolve, reject) => {
          reject(new Error());
        });
    });
    const res = await server.inject({
      method: 'GET',
      url: '/users',
    });
    expect(res.statusCode).toEqual(500);
  });
});
