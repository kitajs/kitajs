import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src/util/paths';
import { parseRoutes } from '../runner';

describe('Path parameter', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 1 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 2);
  });

  test('default path with custom type and multiple params', () => {
    const route = kita.getRoute('getNameNum');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/:name-:num',
      controllerMethod: 'get',
      method: 'GET',
      relativePath: cwdRelative('routes/[name]-[num].ts'),
      parameters: [
        { name: 'PathParameterParser', value: 'req.params.name' },
        { name: 'PathParameterParser', value: 'req.params.num' }
      ],
      schema: {
        operationId: 'getNameNum',
        response: { '2xx': { $ref: 'GetNameNumResponse' } },
        params: {
          type: 'object',
          properties: { name: { type: 'string' }, num: { type: 'number' } },
          required: ['name', 'num'],
          additionalProperties: undefined
        }
      }
    });
  });

  test('default path with custom type and [name, num]', () => {
    const route = kita.getRoute('postNameNum');
    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/:name-:num',
      controllerMethod: 'post',
      method: 'POST',
      relativePath: cwdRelative('routes/[name]-[num].ts'),
      parameters: [
        { name: 'PathParameterParser', value: 'req.params.name' },
        { name: 'PathParameterParser', value: 'req.params.num' }
      ],
      schema: {
        operationId: 'postNameNum',
        response: { '2xx': { $ref: 'PostNameNumResponse' } },
        params: {
          type: 'object',
          properties: { name: { type: 'string' }, num: { type: 'number' } },
          required: ['name', 'num'],
          additionalProperties: undefined
        }
      }
    });
  });
});
