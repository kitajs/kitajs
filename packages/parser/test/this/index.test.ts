import assert from 'node:assert';
import path from 'node:path';
import test, { describe } from 'node:test';
import { parseRoutes } from '../runner';

describe('This & Use usage', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 1 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 2);
  });

  test('single route mapper', () => {
    const route = kita.getRoute('getIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'IndexController',
      controllerPath: path.resolve(__dirname, 'routes/index.ts'),
      controllerPrettyPath: 'test/this/routes/index.ts:4:1',
      kind: 'rest',
      parameters: [],
      schema: {
        response: { default: { type: 'string' } },
        operationId: 'getIndex'
      },
      options: 'IndexController.test($1)'
    });
  });

  test('multiple route mapper', () => {
    const route = kita.getRoute('postIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'IndexController',
      controllerPath: path.resolve(__dirname, 'routes/index.ts'),
      controllerPrettyPath: 'test/this/routes/index.ts:9:1',
      kind: 'rest',
      parameters: [],
      schema: {
        response: { default: { type: 'string' } },
        operationId: 'postIndex'
      },
      options: 'IndexController.test3(IndexController.test2(IndexController.test($1)))'
    });
  });
});
