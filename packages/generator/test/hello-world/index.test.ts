import { Kita } from '@kitajs/runtime';
import fastify from 'fastify';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { generateRuntime } from '../runner';

describe('Hello World', async () => {
  const runtime = await generateRuntime<typeof import('./runtime.kita')>(__dirname);

  test('expects getIndex was generated', () => {
    assert.ok(runtime);
    assert.ok(runtime.runtime);
    assert.ok(runtime.getIndex);
  });

  test('methods are bound correctly', () => {
    assert.equal(runtime.getIndex(), 'Hello World!');
    assert.equal(runtime.getIndex('Arthur'), 'Hello Arthur!');
  });

  test('getIndex options were generated', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.body, 'Hello World!');
    assert.equal(res.statusCode, 200);
  });
});
