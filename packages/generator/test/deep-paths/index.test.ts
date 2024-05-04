import { Kita } from '@kitajs/runtime';
import fastify from 'fastify';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { generateRuntime } from '../runner';

describe('Deep Paths', async () => {
  const runtime = await generateRuntime<typeof import('./runtime.kita')>(__dirname);

  test('expects getIndex was generated', () => {
    assert.ok(runtime);
    assert.ok(runtime.runtime);
    assert.ok(runtime.getABCDE);
  });

  test('methods are bound correctly', () => {
    assert.equal(runtime.getABCDE(), 'Hello World!');
  });

  test('getIndex options were generated', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({ method: 'GET', url: '/a/b/c/d/e' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'Hello World!');
  });
});
