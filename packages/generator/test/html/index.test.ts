import { SuspenseScript } from '@kitajs/html/suspense';
import { Kita } from '@kitajs/runtime';
import fastify from 'fastify';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { generateRuntime } from '../runner';

describe('Html routes', async () => {
  const runtime = await generateRuntime<typeof import('./runtime.kita')>(__dirname);

  test('expects runtime was generated', () => {
    assert.ok(runtime);
    assert.ok(runtime.runtime);
    assert.ok(runtime.getIndexView);
    assert.ok(runtime.postIndexView);
    assert.ok(runtime.putIndexView);
  });

  test('html suspense works', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

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
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({ method: 'POST', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');
    assert.equal(res.body, '<div>Hello World 1</div>');
  });

  test('async html works', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({ method: 'PUT', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');
    assert.equal(res.body, '<div>Hello World 2</div>');
  });
});
