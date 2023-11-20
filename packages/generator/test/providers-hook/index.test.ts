import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type Runtime from './runtime';

describe('Providers Hook', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects all routes were generated', () => {
    assert.ok(rt);
    assert.ok(rt.getIndex);
    assert.ok(rt.postIndex);
    assert.ok(rt.putIndex);
    assert.ok(rt.deleteIndex);
  });

  test('tests application hook', async () => {
    await using app = createApp(rt);

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
    await using app = createApp(rt);

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
    await using app = createApp(rt);

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
    await using app = createApp(rt);

    const res = await app.inject({
      method: 'DELETE',
      url: '/'
    });

    assert.deepStrictEqual(res.json(), {
      t4: { h4: 4 }
    });
  });
});
