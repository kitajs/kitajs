import { Kita } from '@kitajs/runtime';
import fastify from 'fastify';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { generateRuntime } from '../runner';

describe('Providers', async () => {
  const runtime = await generateRuntime<typeof import('./runtime.kita')>(__dirname);

  test('expects getIndex was generated', () => {
    assert.ok(runtime);
    assert.ok(runtime.runtime);
    assert.ok(runtime.getIndex);
  });

  test('get schema was overridden', () => {
    const options = runtime.runtime.routes.find((r) => r.schema?.operationId === 'getIndex');

    assert.deepStrictEqual(options, {
      url: '/',
      method: 'GET',
      handler: options?.handler,
      schema: {
        operationId: 'getIndex',
        response: { '2xx': { type: 'string' } },
        description: 'Overridden description'
      }
    });
  });

  test('post schema was overridden', () => {
    const options = runtime.runtime.routes.find((r) => r.schema?.operationId === 'postIndex');

    assert.deepStrictEqual(options, {
      url: '/',
      method: 'POST',
      handler: options?.handler,
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
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'req-1');
  });

  test('provider generics works', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({ method: 'POST', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.deepStrictEqual(res.json(), ['req-1', 1, app.version]);
  });
});
