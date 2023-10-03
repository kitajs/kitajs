import assert from 'node:assert';
import path from 'node:path';
import test, { describe } from 'node:test';
import { parseRoutes } from '../runner';

describe('Query Parameter', async () => {
  const  kita  = await parseRoutes(__dirname);

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
      controllerPath: path.resolve(__dirname, 'routes/primitive.ts'),
      controllerPrettyPath: 'test/query/routes/primitive.ts:4:1',
      parameters: [{ value: 'req.query.name' }, { value: 'req.query.age' }, { value: 'req.query["custom name"]' }],
      schema: {
        operationId: 'getPrimitive',
        querystring: {
          additionalProperties: undefined,
          properties: {
            'custom name': { type: 'string' },
            age: { type: 'number' },
            name: { type: 'string' }
          },
          required: ['custom name', 'age', 'name'],
          type: 'object'
        },
        response: { default: { type: 'string' } }
      }
    });
  });

  test('works with complex types', () => {
    const route = kita.getRoute('getComplex');

    assert.deepStrictEqual(route, {
      url: '/complex',
      controllerMethod: 'get',
      controllerName: 'ComplexController',
      controllerPath: path.resolve(__dirname, 'routes/complex.ts'),
      controllerPrettyPath: 'test/query/routes/complex.ts:9:1',
      method: 'GET',
      parameters: [{ value: 'req.query' }],
      schema: {
        operationId: 'getComplex',
        querystring: { $ref: 'Complex' },
        response: { default: { type: 'number' } }
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
