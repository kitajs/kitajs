import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import { SuspenseScript } from '@kitajs/html/suspense';
import assert from 'assert';
import type Runtime from './runtime';

describe('Html routes', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects runtime was generated', () => {
    assert.ok(rt);
    assert.ok(rt.getIndexView);
    assert.ok(rt.postIndexView);
    assert.ok(rt.putIndexView);
  });

  test('html suspense works', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');
    // This ensures kita's suspense script is present, but its locked to a specific implementation
    assert.ok(res.body.includes(SuspenseScript));
  });

  test('normal html works', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'POST', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');
    assert.equal(res.body, `<div>Hello World 1</div>`);
  });

  test('async html works', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'PUT', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');
    assert.equal(res.body, `<div>Hello World 2</div>`);
  });
});
