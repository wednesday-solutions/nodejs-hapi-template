import withCORS from '@utils/cors';

beforeEach(() => {});

describe('cors', () => {
  it('should throw for nullish route configs', () => {
    expect(() => withCORS({})).toThrow();
    expect(() => withCORS(1)).toThrow();
    expect(() => withCORS([])).toThrow();
    expect(() => withCORS(null)).toThrow();
    expect(() => withCORS(undefined)).toThrow();
  });

  it('should use default origin', () => {
    expect(withCORS({ options: {} })).toEqual({
      options: { cors: { origin: ['http://localhost:3000'] } },
    });
  });

  it('should support overriding defaults', () => {
    expect(
      withCORS({ options: { cors: { origin: ['https://example.com'] } } })
    ).toEqual({
      options: { cors: { origin: ['https://example.com'] } },
    });
  });
});
