import assert from 'node:assert';
import test, { describe } from 'node:test';
import { parseRoutes } from '../runner';

describe('KitaSchemas Provider', async () => {
  const kita = parseRoutes(__dirname);

  test('expects 1 provider was generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 0);
    assert.equal(kita.getPluginCount(), 0);
    assert.equal(kita.getSchemaCount(), 1);
  });

  test('expects KitaSchemas to be defined', () => {
    const schema = kita.getSchema('KitaSchemas');

    assert.deepStrictEqual(schema, {
      $id: 'KitaSchemas',
      B: {
        type: 'object',
        properties: { a: { type: 'number', const: 1 } },
        required: ['a'],
        additionalProperties: false
      },
      C: {
        type: 'object',
        properties: { g: { type: 'number', const: 2, minLength: 1 } },
        required: ['g'],
        additionalProperties: false
      },
      ApplicationHookNames: {
        type: 'array',
        minItems: 6,
        items: [
          { type: 'string', const: 'onRoute' },
          { type: 'string', const: 'onRegister' },
          { type: 'string', const: 'onReady' },
          { type: 'string', const: 'onListen' },
          { type: 'string', const: 'onClose' },
          { type: 'string', const: 'preClose' }
        ],
        maxItems: 6
      }
    });
  });
});
