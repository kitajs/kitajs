import assert from 'node:assert';
import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type * as Runtime from './runtime.kita';
describe('Hello World', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects getIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.getIndex);
    assert.ok(rt.getIndexHandler);
  });

  test('methods are bound correctly', () => {
    assert.equal(rt.getIndex(), 'Hello World!');
    assert.equal(rt.getIndex('Arthur'), 'Hello Arthur!');
  });

  test('getIndex options were generated', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.body, 'Hello World!');
    assert.equal(res.statusCode, 200);
  });
});
