import { Kita } from '@kitajs/runtime';
import fastify from 'fastify';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { generateRuntime } from '../runner';

describe('This & Use usage', async () => {
  const runtime = await generateRuntime<typeof import('./runtime.kita')>(__dirname);

  test('expects runtime was generated', () => {
    assert.ok(runtime);
    assert.ok(runtime.runtime);
  });

  test('getIndex registers handler 2', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'Hello World!');
    assert.equal(res.headers['x-handler1'], undefined);
    assert.equal(res.headers['x-handler2'], 'true');
    assert.equal(res.headers['x-handler3'], undefined);
  });

  test('postIndex registers 3 handlers', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({ method: 'POST', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'Hello World!');
    assert.equal(res.headers['x-handler1'], 'true');
    assert.equal(res.headers['x-handler2'], 'true');
    assert.equal(res.headers['x-handler3'], 'true');
  });
});
