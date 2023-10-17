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
    assert.equal(
      res.body,
      `<!doctype html><div id="B:1" data-sf><div>fallback</div></div>${SuspenseScript}<template id="N:1" data-sr>Hello World</template><script id="S:1" data-ss>$RC(1)</script>`
    );
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
