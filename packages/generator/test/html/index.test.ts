import test, { describe } from 'node:test';
import { createApp, generateRuntime } from '../runner';

import assert from 'node:assert';
//@ts-ignore - first test may not have been run yet
import { SuspenseScript } from '@kitajs/html/suspense';
import type * as Runtime from './runtime.kita';
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

    // The test below ensures both Fallback, Content and Suspense script are present.
    // There's no need to test the exact content of the response html because kitajs/html
    // has its own tests to ensure the correct html is generated.
    assert.ok(res.body.includes(SuspenseScript));
    assert.ok(res.body.includes('<div>Fallback</div>'));
    assert.ok(res.body.includes('<div>Content</div>'));
  });

  test('normal html works', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'POST', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');
    assert.equal(res.body, '<div>Hello World 1</div>');
  });

  test('async html works', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'PUT', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');
    assert.equal(res.body, '<div>Hello World 2</div>');
  });
});
