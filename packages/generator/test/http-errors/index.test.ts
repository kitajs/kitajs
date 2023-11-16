import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type Runtime from './runtime';

describe('Http Errors', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects getIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.getIndex);
    assert.ok(rt.getIndexHandler);
  });

  test('getIndex throws correctly', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'Success!');

    const res1 = await app.inject({
      method: 'GET',
      url: '/',
      query: { num: '1' }
    });

    assert.equal(res1.statusCode, 400);
    assert.deepStrictEqual(res1.json(), {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Error 1!'
    });

    const res2 = await app.inject({
      method: 'GET',
      url: '/',
      query: { num: '2' }
    });

    assert.equal(res2.statusCode, 500);
    assert.deepStrictEqual(res2.json(), {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Error 2!'
    });
  });
});
