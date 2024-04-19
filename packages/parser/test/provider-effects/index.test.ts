import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Provider effects', async () => {
  const kita = parseRoutes(__dirname);

  test('expects 1 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 1);
    assert.equal(kita.getRouteCount(), 1);
    assert.equal(kita.getPluginCount(), 2);
  });

  test('created fastifySwagger plugin', () => {
    assert.ok(kita.getPlugin('fastifySwagger'));
  });

  test('created fastifyScalarUi plugin', () => {
    assert.ok(kita.getPlugin('fastifyScalarUi'));
  });

  test('provider has a parameter generator', () => {
    const provider = kita.getProvider('ProviderWithEffect');

    assert.deepStrictEqual(provider, {
      async: false,
      type: 'ProviderWithEffect',
      providerPath: cwdRelative('providers/index.ts'),
      schemaTransformer: false,
      applicationHooks: [],
      lifecycleHooks: [],
      parseParameters: provider?.parseParameters
    });
  });

  test('route has a body schema', () => {
    const route = kita.getRoute('postIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      relativePath: cwdRelative('routes/index.ts'),
      parameters: [
        {
          name: 'ProviderParameterParser',
          value: 'param1',
          providerName: 'ProviderWithEffect',
          imports: [{ name: 'ProviderWithEffect', path: cwdRelative('providers/index.ts') }],
          schemaTransformer: false,
          helper: 'const param1 = ProviderWithEffect.default(req.body);'
        }
      ],
      schema: {
        operationId: 'postIndex',
        response: { '2xx': { type: 'number', const: 1 } },
        body: {
          type: 'object',
          properties: { a: { type: 'number', const: 1 } },
          required: ['a'],
          additionalProperties: false
        }
      }
    });
  });
});
