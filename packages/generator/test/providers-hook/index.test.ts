import { Kita } from '@kitajs/runtime';
import fastify from 'fastify';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { generateRuntime } from '../runner';

describe('Providers Hook', async () => {
  const runtime = await generateRuntime<typeof import('./runtime.kita')>(__dirname);

  test('expects all routes were generated', () => {
    assert.ok(runtime);
    assert.ok(runtime.runtime);
    assert.ok(runtime.getIndex);
    assert.ok(runtime.postIndex);
    assert.ok(runtime.putIndex);
    assert.ok(runtime.deleteIndex);
  });

  test('tests application hook', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({
      method: 'GET',
      url: '/'
    });

    assert.deepStrictEqual(res.json(), {
      app: { h1: 1 },
      t1: { h1: 1 }
    });
  });

  test('tests lifecycle hook', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({
      method: 'POST',
      url: '/'
    });

    assert.deepStrictEqual(res.json(), {
      app2: { h2a: 2 },
      reply: { h2c: 3 },
      request: { h2b: 2 },
      t2: { h2: 2 }
    });
  });

  test('tests lifecycle and application hook', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({
      method: 'PUT',
      url: '/'
    });

    assert.deepStrictEqual(res.json(), {
      app1: { h3d: 1 },
      app2: { h3a: 2 },
      reply: { h3c: 3 },
      request: { h3b: 2 },
      t3: { h3: 3 }
    });
  });

  test('tests no hooks', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({
      method: 'DELETE',
      url: '/'
    });

    assert.deepStrictEqual(res.json(), {
      t4: { h4: 4 }
    });
  });
});
