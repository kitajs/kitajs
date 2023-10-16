import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type Runtime from './runtime';

describe('This & Use usage', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects getIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.getIndex);
    assert.ok(rt.getIndexHandler);
    assert.ok(rt.postIndex);
    assert.ok(rt.postIndexHandler);
  });

  test('GET / only has handler', () => {
    //@ts-expect-error - internal property
    const options = rt.getIndexOptions;

    assert.ok(options.handler1 === undefined);
    assert.ok(options.handler2);
    assert.ok(options.handler3 === undefined);
  });
  test('POST / has 3 handler', () => {
    //@ts-expect-error - internal property
    const options = rt.postIndexOptions;

    assert.ok(options.handler1);
    assert.ok(options.handler2);
    assert.ok(options.handler3);
  });

  test('getIndex registers handler 2', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'Hello World!');
    assert.equal(res.headers['x-handler1'], undefined);
    assert.equal(res.headers['x-handler2'], 'true');
    assert.equal(res.headers['x-handler3'], undefined);
  });

  test('postIndex registers 3 handlers', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'POST', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'Hello World!');
    assert.equal(res.headers['x-handler1'], 'true');
    assert.equal(res.headers['x-handler2'], 'true');
    assert.equal(res.headers['x-handler3'], 'true');
  });
});
