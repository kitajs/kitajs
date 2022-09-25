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

  it('custom res.send', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/req-rep'
    }); 

    console.log(res)

    expect(res.body).toBe('Custom send without return clause');
  });
});
