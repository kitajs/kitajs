import assert from 'node:assert';
import test, { describe } from 'node:test';
import { parseRoutes } from '../runner';

describe('Providers', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 1 route was generated', () => {
    assert.equal(kita.getProviderCount(), 1);
    assert.equal(kita.getRouteCount(), 1);
  });

  test('hello world route', () => {
    const route = kita.getRoute('getIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'IndexController',
      controllerPath: 'routes/index.ts',
      schema: { response: { default: { type: 'number', const: 1 } }, operationId: 'getIndex' },
      kind: 'rest',
      parameters: [
        {
          value: 'param0',
          helper: 'const param0 = await Resolver0();',
          imports: [{ name: 'Resolver0', path: 'providers/test.ts' }]
        }
      ]
    });
  });

  test('generated provider', () => {
    const provider = kita.getProvider('Test');

    assert.deepStrictEqual(provider, {
      async: false,
      type: 'Test',
      providerPath: 'providers/test.ts',
      parameters: [],
      schemaTransformer: false
    });
  });
});
