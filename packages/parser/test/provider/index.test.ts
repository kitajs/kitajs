import assert from 'node:assert';
import test, { describe } from 'node:test';
import { parseRoutes } from '../runner';

describe('Providers', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 2 route was generated', () => {
    assert.equal(kita.getProviderCount(), 2);
    assert.equal(kita.getRouteCount(), 2);
  });

  test('hello world route', () => {
    const route = kita.getRoute('getIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'IndexController',
      controllerPath: './routes/index.ts',
      schema: { response: { ['2xx']: { type: 'number', const: 1 } }, operationId: 'getIndex' },
      kind: 'rest',
      parameters: [
        {
          value: 'param0',
          helper: 'const param0 = Resolver0();',
          imports: [{ name: 'Resolver0', path: './providers/test.ts' }],
          providerName: 'Resolver0',
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
      controllerName: 'IndexController',
      controllerPath: './routes/index.ts',
      parameters: [
        {
          value: 'param0',
          imports: [{ name: '* as Resolver0', path: './providers/transformer.ts' }],
          helper: 'const param0 = await Resolver0.default();',
          providerName: 'Resolver0',
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
      providerPath: './providers/test.ts',
      parameters: [],
      schemaTransformer: false
    });
  });

  test('generated provider with transform', () => {
    const provider = kita.getProvider('Transformer');

    assert.deepStrictEqual(provider, {
      async: true,
      type: 'Transformer',
      providerPath: './providers/transformer.ts',
      parameters: [],
      schemaTransformer: true
    });
  });
});
