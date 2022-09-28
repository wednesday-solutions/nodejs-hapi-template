import { resetAndMockDB } from '@utils/testUtils';

describe('/github route tests', () => {
  const data = { data: 'this is fine' };
  it('respond with status 200 and correct message when CB is closed', async () => {
    process.env.ENVIRONMENT_NAME = 'local';
    process.env.IS_TESTING = 'local';
    server = await resetAndMockDB();
    require('@services/circuitbreaker').__setupMocks(() => ({ data }));

    const res = await server.inject({
      method: 'GET',
      url: '/github?repo=react-template',
    });
    expect(res.statusCode).toBe(200);
    expect(res.result).toStrictEqual(data);
    process.env.ENVIRONMENT_NAME = 'test';
  });
  it('respond with status 424 and an error message when CB is open', async () => {
    process.env.ENVIRONMENT_NAME = 'local';
    const error = 'Github API is down.';
    server = await resetAndMockDB();
    await require('@services/circuitbreaker').__setupMocks(() => ({
      error,
    }));

    const res = await server.inject({
      method: 'GET',
      url: '/github?repo=react-template',
    });

    expect(res.statusCode).toBe(424);
    expect(res.result).toStrictEqual({ error });
  });
});
