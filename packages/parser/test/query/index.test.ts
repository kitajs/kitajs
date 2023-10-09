import assert from 'node:assert';
import test, { describe } from 'node:test';
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
      controllerPath: './routes/primitive.ts',
      parameters: [{ value: 'req.query.name' }, { value: 'req.query.age' }, { value: 'req.query["custom name"]' }],
      kind: 'rest',
      schema: {
        operationId: 'getPrimitive',
        querystring: {
          additionalProperties: undefined,
          properties: {
            'custom name': { type: 'string' },
            age: { type: 'number' },
            name: { type: 'string' }
          },
          required: ['name', 'age', 'custom name'],
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
      controllerPath: './routes/complex.ts',
      method: 'GET',
      parameters: [{ value: 'req.query' }],
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
