import { resetAndMockDB } from '@utils/testUtils';
import { mockData, createMockTokenWithScope } from '@utils/mockData';
import { SCOPE_TYPE, OAUTH_CLIENT_ID } from '@utils/constants';

const superAdminToken = createMockTokenWithScope(
  SCOPE_TYPE.SUPER_ADMIN,
  OAUTH_CLIENT_ID
);

const superAdminAuth = {
  credentials: { ...superAdminToken },
  strategy: 'bearer',
};

const { MOCK_USER: user } = mockData;

describe('/reset-cache route tests', () => {
  let server;
  it('should delete the user details from users if available', async () => {
    jest.doMock('@root/server', () => ({
      server: {
        ...server,
        methods: {
          findOneUser: {
            cache: {
              drop: async () => jest.fn(),
            },
          },
        },
      },
    }));
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.users.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return user;
        }
      });
    });
    const res = await server.inject({
      method: 'DELETE',
      url: '/reset-cache/users/1',
      auth: superAdminAuth,
    });
    expect(res.statusCode).toEqual(200);
  });

  it('should return badRequest if error is caught', async () => {
    jest.doMock('@root/server', () => ({
      server: {
        ...server,
        methods: {
          findOneUser: {
            cache: {
              drop: async () =>
                new Promise((resolve, reject) => reject(new Error('e'))),
            },
          },
        },
      },
    }));
    server = await resetAndMockDB(async (allDbs) => {
      allDbs.models.users.$queryInterface.$useHandler((query) => {
        if (query === 'findById') {
          return null;
        }
      });
    });
    const res = await server.inject({
      method: 'DELETE',
      url: '/reset-cache/users/1',
      auth: superAdminAuth,
    });
    expect(res.statusCode).toEqual(400);
  });
});
