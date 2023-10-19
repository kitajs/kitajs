import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('BodyProp Parameter', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 1 routes was generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 1);
    assert.equal(kita.getSchemaCount(), 2);
  });

  test('works with multiple body prop definitions', () => {
    const route = kita.getRoute('postIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'IndexController',
      controllerPath: cwdRelative('routes/index.ts'),
      parameters: [
        { name: 'BodyPropParameterParser', value: 'req.body.name' },
        { name: 'BodyPropParameterParser', value: 'req.body.a' },
        { name: 'BodyPropParameterParser', value: 'req.body.type' },
        { name: 'BodyPropParameterParser', value: 'req.body["type 2"]' }
      ],
      schema: {
        operationId: 'postIndex',
        response: { ['2xx']: { $ref: 'postIndexResponse' } },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            a: {
              additionalProperties: false,
              properties: { a: { type: 'number' } },
              required: ['a'],
              type: 'object'
            },
            type: { $ref: 'Type' },
            'type 2': { type: 'number' }
          },
          required: ['name', 'a', 'type', 'type 2'],
          additionalProperties: undefined
        }
      }
    });
  });

  test('generated Type schema', () => {
    const schema = kita.getSchema('Type');

    assert.deepStrictEqual(schema, {
      $id: 'Type',
      additionalProperties: false,
      properties: { b: { type: 'number' } },
      required: ['b'],
      type: 'object'
    });
  });
});
