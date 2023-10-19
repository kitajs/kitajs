import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type Runtime from './runtime';

describe('Providers', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects getIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.getIndex);
    assert.ok(rt.getIndexHandler);
  });

  test('get schema was overridden', () => {
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

  test('post schema was overridden', () => {
    //@ts-expect-error - internal property
    const options = rt.postIndexOptions;

    assert.deepStrictEqual(options, {
      url: '/',
      method: 'POST',
      handler: rt.postIndexHandler,
      schema: {
        operationId: 'postIndex',
        response: {
          '2xx': {
            items: [{ type: 'string' }, { type: 'number' }, { type: 'string' }],
            maxItems: 3,
            minItems: 3,
            type: 'array'
          }
        },
        // Only 1 was inside generics
        description: '1'
      }
    });
  });

  test('getIndex returns request id', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'req-1');
  });

  test('provider generics works', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'POST', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.deepStrictEqual(res.json(), ['req-1', 1, app.version]);
  });
});
