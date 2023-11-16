import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('JSDoc usage on route', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 3 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 4);
  });

  test('works with simple jsDocs', () => {
    const route = kita.getRoute('hello-world');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      relativePath: cwdRelative('routes/index.ts'),
      kind: 'rest',
      parameters: [],
      schema: {
        summary: 'C',
        tags: ['A', 'B'],
        response: { '2xx': { type: 'string' } },
        operationId: 'hello-world',
        description: 'D'
      }
    });
  });

  test('prefers @description over normal description', () => {
    const route = kita.getRoute('postIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      relativePath: cwdRelative('routes/index.ts'),
      kind: 'rest',
      parameters: [],
      schema: {
        description: 'B',
        response: { '2xx': { type: 'string' } },
        operationId: 'postIndex'
      }
    });
  });

  test('works with complex jsdocs', () => {
    const route = kita.getRoute('deleteIndex');

    assert.deepStrictEqual(route, {
      url: '/not-index',
      controllerMethod: 'put',
      method: 'DELETE',
      relativePath: cwdRelative('routes/index.ts'),
      kind: 'rest',
      parameters: [],
      schema: {
        response: { '2xx': { type: 'string' } },
        operationId: 'deleteIndex',
        deprecated: true,
        description: undefined
      }
    });
  });

  test('@internal adds hide', () => {
    const route = kita.getRoute('putIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'Delete',
      method: 'PUT',
      relativePath: cwdRelative('routes/index.ts'),
      kind: 'rest',
      parameters: [],
      schema: {
        response: { '2xx': { type: 'string' } },
        operationId: 'putIndex',
        hide: true
      }
    });
  });
});
