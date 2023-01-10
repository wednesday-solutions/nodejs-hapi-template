afterAll(() => {
  process.env.ENVIRONMENT_NAME = 'local';
});

beforeEach(() => {
  process.env.ENVIRONMENT_NAME = 'local';
});

describe('env', () => {
  it('should get ENVIRONMENT_NAME if it is valid', () => {
    process.env.ENVIRONMENT_NAME = 'prod';

    let guardAgainst;
    jest.isolateModules(() => {
      guardAgainst = require('../env').default;
    });
    expect(() => {
      console.log(guardAgainst.ENVIRONMENT_NAME);
    }).not.toThrow();
    expect(guardAgainst.ENVIRONMENT_NAME).toBe('prod');
  });
});
