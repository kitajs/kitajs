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

  it('tests with Suspense', () => {
    const route = kita.getRoute('getIndexView');

    assert.deepStrictEqual(route, {
      kind: 'html',
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      relativePath: cwdRelative('routes/index.tsx'),
      parameters: [{ name: 'FastifyParameterParser', value: 'req' }],
      customSend: 'html',
      schema: {
        operationId: 'getIndexView',
        hide: true,
        response: { '200': { type: 'string' } }
      }
    });
  });

  it('Sync html', () => {
    const route = kita.getRoute('postIndexView');

    assert.deepStrictEqual(route, {
      kind: 'html',
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      relativePath: cwdRelative('routes/index.tsx'),
      parameters: [],
      customSend: 'html',
      schema: {
        operationId: 'postIndexView',
        hide: true,
        response: { '200': { type: 'string' } }
      }
    });
  });

  it('Async html', () => {
    const route = kita.getRoute('putIndexView');

    assert.deepStrictEqual(route, {
      kind: 'html',
      url: '/',
      controllerMethod: 'put',
      method: 'PUT',
      relativePath: cwdRelative('routes/index.tsx'),
      parameters: [],
      customSend: 'html',
      schema: {
        operationId: 'putIndexView',
        hide: true,
        response: { '200': { type: 'string' } }
      }
    });
  });
});
