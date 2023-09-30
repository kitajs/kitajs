import assert from 'node:assert';
import path from 'node:path';
import test, { describe } from 'node:test';
import { parseRoutes } from '../runner';

describe('JSDoc usage on route', async () => {
  const { kita } = await parseRoutes(__dirname);

  test('expects 3 routes were generated', () => {
    assert.equal(kita.providers.size, 0);
    assert.equal(kita.routes.size, 3);
  });

  test('works with simple jsdocs', () => {
    const route = kita.routes.get('getIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'IndexController',
      controllerPath: path.resolve(__dirname, 'routes/index.ts'),
      controllerPrettyPath: 'test/jsdoc/routes/index.ts:10:1',
      parameters: [],
      schema: {
        summary: 'C',
        tags: ['B', 'A'],
        response: { default: { type: 'string' } },
        operationId: 'getIndex'
      }
    });
  });

  test('prefers @description over normal description', () => {
    const route = kita.routes.get('postIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'IndexController',
      controllerPath: path.resolve(__dirname, 'routes/index.ts'),
      controllerPrettyPath: 'test/jsdoc/routes/index.ts:19:1',
      parameters: [],
      schema: {
        description: 'B',
        response: { default: { type: 'string' } },
        operationId: 'postIndex'
      }
    });
  });

  test('works with complex jsdocs', () => {
    const route = kita.routes.get('putIndex');

    assert.deepStrictEqual(route, {
      url: '/not-index',
      controllerMethod: 'put',
      method: 'DELETE',
      controllerName: 'IndexController',
      controllerPath: path.resolve(__dirname, 'routes/index.ts'),
      controllerPrettyPath: 'test/jsdoc/routes/index.ts:31:1',
      parameters: [],
      schema: {
        response: { default: { type: 'string' } },
        operationId: 'putIndex',
        deprecated: true,
        description: undefined
      }
    });
  });
});
