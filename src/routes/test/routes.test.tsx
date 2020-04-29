import url from 'routes/utils';

describe('test Url', () => {
  const baseUrl = url('/path/:uuid');

  it('test url invalid uuid', () => {
    global.console = {
      ...global.console,
      warn: jest.fn(),
    };
    const params = { uuid: 'invalid' };
    const result = baseUrl.buildPath(params);
    expect(result).toBe(`/path/${params.uuid}`);
  });

  it('test buildPath exceptions', () => {
    global.console = {
      ...global.console,
      error: jest.fn(),
    };
    const params = { asd: 'invalid' };
    const result = baseUrl.buildPath(params);
    expect(result).toBe('#');
  });

  it('test url result', () => {
    const params = { uuid: '123' };
    const result = baseUrl.buildPath(params);
    expect(result).toBe(`/path/${params.uuid}`);
  });

  it('test buildPath', () => {
    const uuid = 123;
    const orderBy = 'name';
    const user = 'admin';
    const result = baseUrl.buildPath({
      uuid,
      queryParams: {
        user,
        order_by: orderBy,
      },
    });
    const expected = `/path/${uuid}?order_by=${orderBy}&user=${user}`;
    expect(result).toEqual(expected);
  });

  it('test buildPath exception', () => {
    global.console = {
      ...global.console,
      error: jest.fn(), // NOTE: Disable error logging for this test
    };
    const result = baseUrl.buildPath({ name: 1 });
    const expected = '#';
    expect(result).toEqual(expected);
  });

  it('test valueOf', () => {
    expect(baseUrl.valueOf).toThrow();
  });

  it('test toString', () => {
    expect(baseUrl.toString).toThrow();
  });
});
