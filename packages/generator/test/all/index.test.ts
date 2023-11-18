import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type Runtime from './runtime';

const { supportedMethods } = require('fastify/lib/httpMethods');

describe('Correctly handles ALL methods', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects allIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.allIndex);
    assert.ok(rt.allIndexHandler);
  });

  test('methods are bound correctly', () => {
    assert.equal(rt.allIndex(), 'Hello World!');
  });

  test(`Ensure all works all supported methods`, async (t) => {
    await using app = createApp(rt);

    // https://github.com/fastify/fastify/blob/main/lib/httpMethods.js
    assert.ok(Array.isArray(supportedMethods));

    for (const method of supportedMethods) {
      await t.test(method, async () => {
        const res = await app.inject({ method, url: '/' });
        assert.equal(res.statusCode, 200);
        assert.equal(res.body, 'Hello World!');
      });
    }
  });
});
