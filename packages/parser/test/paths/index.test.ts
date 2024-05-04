import { kRequestParam } from '@kitajs/common';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Path parameter', async () => {
  const kita = parseRoutes(__dirname);

  test('expects 2 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 4);
  });

  test('default path usage', () => {
    const route = kita.getRoute('getName');

    assert.deepStrictEqual(route, {
      url: '/:name',
      controllerMethod: 'get',
      method: 'GET',
      relativePath: cwdRelative('routes/[name].ts'),
      kind: 'rest',
      controllerName: 'NameController',
      parameters: [{ name: 'PathParameterParser', value: `${kRequestParam}.params.name` }],
      schema: {
        params: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name'],
          additionalProperties: undefined
        },
        response: { '2xx': { type: 'string' } },
        operationId: 'getName'
      }
    });
  });

  test('default path usage with custom name', () => {
    const route = kita.getRoute('postName');

    assert.deepStrictEqual(route, {
      url: '/:name',
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'NameController',
      relativePath: cwdRelative('routes/[name].ts'),
      parameters: [{ name: 'PathParameterParser', value: `${kRequestParam}.params.name` }],
      kind: 'rest',
      schema: {
        params: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name'],
          additionalProperties: undefined
        },
        response: { '2xx': { type: 'string' } },
        operationId: 'postName'
      }
    });
  });

  test('default path with custom type', () => {
    const route = kita.getRoute('getNum');

    assert.deepStrictEqual(route, {
      url: '/:num',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'NumController',
      relativePath: cwdRelative('routes/[num].ts'),
      parameters: [{ name: 'PathParameterParser', value: `${kRequestParam}.params.num` }],
      kind: 'rest',
      schema: {
        params: {
          type: 'object',
          properties: { num: { type: 'number' } },
          required: ['num'],
          additionalProperties: undefined
        },
        response: { '2xx': { type: 'number' } },
        operationId: 'getNum'
      }
    });
  });

  test('default path with custom type and name', () => {
    const route = kita.getRoute('postNum');

    assert.deepStrictEqual(route, {
      url: '/:num',
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'NumController',
      relativePath: cwdRelative('routes/[num].ts'),
      parameters: [{ name: 'PathParameterParser', value: `${kRequestParam}.params.num` }],
      kind: 'rest',
      schema: {
        params: {
          type: 'object',
          properties: { num: { type: 'number' } },
          required: ['num'],
          additionalProperties: undefined
        },
        response: { '2xx': { type: 'number' } },
        operationId: 'postNum'
      }
    });
  });
});
