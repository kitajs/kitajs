import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type Runtime from './runtime';

describe('Deep Paths', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects getIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.getABCDE);
    assert.ok(rt.getABCDEHandler);
  });

  test('methods are bound correctly', () => {
    assert.equal(rt.getABCDE(), 'Hello World!');
  });

  test('getIndex options were generated', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'GET', url: '/a/b/c/d/e' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'Hello World!');
  });
});
