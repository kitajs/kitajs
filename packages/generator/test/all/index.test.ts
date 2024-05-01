import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import { HttpMethods } from '@kitajs/parser';
import type * as Runtime from './runtime.kita';
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

  test('Ensure all works all supported methods', async (t) => {
    await using app = createApp(rt);

    for (const method of HttpMethods) {
      await t.test(method, async () => {
        const res = await app.inject({ method: method as 'GET', url: '/' });
        assert.equal(res.statusCode, 200);
        assert.equal(res.body, 'Hello World!');
      });
    }
  });
});
