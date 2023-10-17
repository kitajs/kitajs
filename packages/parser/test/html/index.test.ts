import assert from 'node:assert';
import test, { describe, it } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Html routes', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 3 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 3);
  });

  it('tests with suspense', () => {
    const route = kita.getRoute('getIndexView');

    assert.deepStrictEqual(route, {
      kind: 'html',
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'IndexController',
      controllerPath: cwdRelative('routes/index.tsx'),
      parameters: [{ value: 'req.id', __type: 'SuspenseId' }],
      schema: {
        operationId: 'getIndexView',
        hide: true,
        response: { [200]: { type: 'string' } }
      },
      imports: [{ name: '{ renderToStream }', path: '@kitajs/html/suspense' }],
      customReturn:
        "return reply.type('text/html; charset=utf-8').send(renderToStream(IndexController.get.bind(undefined, req.id), req.id));"
    });
  });

  it('sync html', () => {
    const route = kita.getRoute('postIndexView');

    assert.deepStrictEqual(route, {
      kind: 'html',
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'IndexController',
      controllerPath: cwdRelative('routes/index.tsx'),
      parameters: [],
      schema: {
        operationId: 'postIndexView',
        hide: true,
        response: { [200]: { type: 'string' } }
      },
      customReturn: "reply.type('text/html; charset=utf-8'); return IndexController.post.call(undefined)"
    });
  });

  it('async html', () => {
    const route = kita.getRoute('putIndexView');

    assert.deepStrictEqual(route, {
      kind: 'html',
      url: '/',
      controllerMethod: 'put',
      method: 'PUT',
      controllerName: 'IndexController',
      controllerPath: cwdRelative('routes/index.tsx'),
      parameters: [],
      schema: {
        operationId: 'putIndexView',
        hide: true,
        response: { [200]: { type: 'string' } }
      },
      customReturn: "reply.type('text/html; charset=utf-8'); return IndexController.put.call(undefined)"
    });
  });
});
