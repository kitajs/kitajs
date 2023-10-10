import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Hello World', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 1 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 1);
  });

  test('generates hello world', () => {
    const route = kita.getRoute('getIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'IndexController',
      controllerPath: cwdRelative('routes/index.ts'),
      parameters: [{ value: 'req.query.name' }],
      schema: {
        querystring: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: [],
          additionalProperties: undefined
        },
        response: { ['2xx']: { type: 'string' } },
        operationId: 'getIndex',
        description: 'Hello world API endpoint.'
      }
    });
  });
});
