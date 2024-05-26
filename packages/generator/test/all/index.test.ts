import { HttpMethods } from '@kitajs/parser';
import { Kita } from '@kitajs/runtime';
import fastify from 'fastify';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { generateRuntime } from '../runner';

describe('Correctly handles ALL methods', async () => {
  const runtime = await generateRuntime<typeof import('./runtime.kita')>(__dirname);

  test('expects allIndex was generated', () => {
    assert.ok(runtime);
    assert.ok(runtime.runtime);
    assert.ok(runtime.allIndex);
  });

  test('methods are bound correctly', () => {
    assert.equal(runtime.allIndex(), 'Hello World!');
  });

  test('Ensure all works all supported methods', async (t) => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    for (const method of HttpMethods) {
      await t.test(method, async () => {
        const res = await app.inject({ method: method as 'GET', url: '/' });
        assert.equal(res.statusCode, 200);
        assert.equal(res.body, 'Hello World!');
      });
    }
  });
});
