import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type Runtime from './runtime';

describe('Hello World', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects getIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.getIndex);
    assert.ok(rt.getIndexHandler);
  });

  test('schema was overridden', () => {
    //@ts-expect-error - internal property
    const options = rt.getIndexOptions;

    assert.deepStrictEqual(options, {
      url: '/',
      method: 'GET',
      handler: rt.getIndexHandler,
      schema: {
        operationId: 'getIndex',
        response: { '2xx': { type: 'string' } },
        description: 'Overridden description'
      }
    });
  });

  test('getIndex returns request id', async () => {
    const app = createApp(rt);

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'req-1');

    await app.close();
  });
});
