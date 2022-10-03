import { app } from '../src/app';

describe('Tests with request and response parameters', () => {
  it('Req works', async () => {
    const { body, headers } = await app.inject({
      method: 'GET',
      url: '/req-rep'
    });

    expect(headers.test).toBe(true);
    expect(body).toBe('GET');
  });
});
