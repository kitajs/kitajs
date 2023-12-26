import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Providers', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 2 route was generated', () => {
    assert.equal(kita.getProviderCount(), 3);
    assert.equal(kita.getRouteCount(), 3);
  });

  test('hello world route', () => {
    const route = kita.getRoute('getIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      relativePath: cwdRelative('routes/index.ts'),
      schema: {
        response: { '2xx': { type: 'number', const: 1 } },
        operationId: 'getIndex'
      },
      kind: 'rest',
      parameters: [
        {
          value: 'param0',
          name: 'ProviderParameterParser',
          helper: 'const param0 = Test.default();',
          imports: [{ name: 'Test', path: cwdRelative('providers/test.ts') }],
          providerName: 'Test',
          schemaTransformer: false
        }
      ]
    });
  });

  test('post hello world has provider', () => {
    const route = kita.getRoute('postIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      relativePath: cwdRelative('routes/index.ts'),
      parameters: [
        {
          value: 'param0',
          name: 'ProviderParameterParser',
          imports: [
            {
              name: 'Transformer',
              path: cwdRelative('providers/transformer.ts')
            }
          ],
          helper: 'const param0 = await Transformer.default();',
          providerName: 'Transformer',
          schemaTransformer: true
        }
      ],
      schema: {
        operationId: 'postIndex',
        response: { '2xx': { type: 'number', const: 1 } }
      }
    });
  });

  test('generated provider', () => {
    const provider = kita.getProvider('Test');

    assert.deepStrictEqual(provider, {
      async: false,
      type: 'Test',
      providerPath: cwdRelative('providers/test.ts'),
      parseParameters: provider?.parseParameters,
      schemaTransformer: false,
      applicationHooks: [],
      lifecycleHooks: []
    });
  });

  test('generated provider with transform', () => {
    const provider = kita.getProvider('Transformer');

    assert.deepStrictEqual(provider, {
      async: true,
      type: 'Transformer',
      providerPath: cwdRelative('providers/transformer.ts'),
      parseParameters: provider?.parseParameters,
      schemaTransformer: true,
      applicationHooks: [],
      lifecycleHooks: []
    });
  });

  test('provider with generics', () => {
    const route = kita.getRoute('putIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'put',
      method: 'PUT',
      relativePath: cwdRelative('routes/index.ts'),
      parameters: [
        {
          name: 'ProviderParameterParser',
          value: 'param1',
          imports: [{ name: 'GenericTest', path: cwdRelative('providers/generics.ts') }],
          schemaTransformer: false,
          providerName: 'GenericTest',
          helper: `const param1 = GenericTest.default([123, false, 'Hello']);`
        }
      ],
      schema: {
        operationId: 'putIndex',
        response: {
          '2xx': {
            type: 'array',
            minItems: 3,
            items: [
              { type: 'number', const: 123 },
              { type: 'boolean', const: false },
              { type: 'string', const: 'Hello' }
            ],
            maxItems: 3
          }
        }
      }
    });
  });
});
