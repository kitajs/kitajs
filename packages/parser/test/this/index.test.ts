import { kControllerName } from '@kitajs/common';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
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
      relativePath: cwdRelative('routes/index.ts'),
      kind: 'rest',
      parameters: [],
      schema: {
        response: { ['2xx']: { type: 'string' } },
        operationId: 'getIndex'
      },
      options: `${kControllerName}.test2($1)`
    });
  });

  test('multiple route mapper', () => {
    const route = kita.getRoute('postIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      relativePath: cwdRelative('routes/index.ts'),
      kind: 'rest',
      parameters: [],
      schema: {
        response: { ['2xx']: { type: 'string' } },
        operationId: 'postIndex'
      },
      options: `${kControllerName}.test3(${kControllerName}.test2(${kControllerName}.test($1)))`
    });
  });
});
