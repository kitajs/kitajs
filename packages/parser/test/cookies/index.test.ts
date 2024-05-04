import { kRequestParam } from '@kitajs/common';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Cookies', async () => {
  const kita = parseRoutes(__dirname);

  test('expects 2 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 2);
    assert.equal(kita.getPluginCount(), 3);
  });

  test('created fastifyCookie plugin', () => {
    assert.ok(kita.getPlugin('fastifyCookie'));
  });

  test('handle cookie variations', () => {
    const route = kita.getRoute('getIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'IndexController',
      relativePath: cwdRelative('routes/index.ts'),
      kind: 'rest',
      parameters: [
        {
          name: 'CookieParameterParser',
          value: `${kRequestParam}.cookies.a`,
          helper: `if (${kRequestParam}.cookies.a === undefined) { throw new Error('Missing cookie a') };`
        },
        {
          name: 'CookieParameterParser',
          value: `${kRequestParam}.cookies["c c"]`,
          helper: `if (${kRequestParam}.cookies["c c"] === undefined) { throw new Error('Missing cookie c c') };`
        },
        {
          name: 'CookieParameterParser',
          value: `${kRequestParam}.cookies.d`,
          helper: `if (${kRequestParam}.cookies.d === undefined) { throw new Error('Missing cookie d') };`
        }
      ],
      schema: {
        response: { '2xx': { type: 'string' } },
        operationId: 'getIndex'
      }
    });
  });

  test('cookie default values', () => {
    const route = kita.getRoute('postIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'IndexController',
      relativePath: cwdRelative('routes/index.ts'),
      kind: 'rest',
      parameters: [
        { name: 'CookieParameterParser', value: `${kRequestParam}.cookies.a`, helper: undefined },
        { name: 'CookieParameterParser', value: `${kRequestParam}.cookies.b`, helper: undefined },
        {
          name: 'CookieParameterParser',
          value: `${kRequestParam}.cookies.c`,
          helper: `if (${kRequestParam}.cookies.c === undefined) { throw new Error('Missing cookie c') };`
        },
        { name: 'CookieParameterParser', value: `${kRequestParam}.cookies.d`, helper: undefined }
      ],
      schema: {
        response: { '2xx': { type: 'string' } },
        operationId: 'postIndex'
      }
    });
  });
});
