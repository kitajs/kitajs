import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Query Parameter', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 2 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 2);
  });

  test('works with primitive types', () => {
    const route = kita.getRoute('getPrimitive');

    assert.deepStrictEqual(route, {
      url: '/primitive',
      method: 'GET',
      controllerMethod: 'get',
      controllerName: 'PrimitiveController',
      controllerPath: cwdRelative('routes/primitive.ts'),
      parameters: [
        { name: 'QueryParameterParser', value: 'req.query.name' },
        { name: 'QueryParameterParser', value: 'req.query.age' },
        { name: 'QueryParameterParser', value: 'req.query["custom name"]' },
        { name: 'QueryParameterParser', value: 'req.query.date' }
      ],
      kind: 'rest',
      schema: {
        operationId: 'getPrimitive',
        querystring: {
          additionalProperties: undefined,
          properties: {
            'custom name': { type: 'string' },
            age: { type: 'number' },
            name: { type: 'string' },
            date: { format: 'date-time', type: 'string' }
          },
          required: ['name', 'age', 'custom name', 'date'],
          type: 'object'
        },
        response: { ['2xx']: { type: 'string' } }
      }
    });
  });

  test('works with complex types', () => {
    const route = kita.getRoute('getComplex');

    assert.deepStrictEqual(route, {
      url: '/complex',
      controllerMethod: 'get',
      controllerName: 'ComplexController',
      controllerPath: cwdRelative('routes/complex.ts'),
      method: 'GET',
      parameters: [{ name: 'QueryParameterParser', value: 'req.query' }],
      kind: 'rest',
      schema: {
        operationId: 'getComplex',
        querystring: { $ref: 'Complex' },
        response: { ['2xx']: { type: 'number' } }
      }
    });

    const complexSchema = kita.getSchema('Complex');

    assert.deepStrictEqual(complexSchema, {
      $id: 'Complex',
      additionalProperties: false,
      properties: {
        a: { type: 'number' },
        b: { type: 'number' }
      },
      required: ['a', 'b'],
      type: 'object'
    });
  });
});
