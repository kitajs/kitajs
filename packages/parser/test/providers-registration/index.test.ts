import { kReplyParam } from '@kitajs/common';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src/util/paths';
import { parseRoutes } from '../runner';

describe('Providers Registration', async () => {
  const kita = parseRoutes(__dirname);

  test('expects 4 providers were generated', () => {
    assert.equal(kita.getProviderCount(), 4);
    assert.equal(kita.getRouteCount(), 2);
  });

  test('providers were parsed correctly', () => {
    const providers = kita.getProviders();

    assert.deepStrictEqual(providers, [
      {
        async: false,
        type: 'ProviderA',
        providerPath: cwdRelative('providers/a.ts'),
        parseParameters: providers[0]?.parseParameters,
        schemaTransformer: false,
        applicationHooks: [],
        lifecycleHooks: []
      },
      {
        async: false,
        type: 'ProviderB',
        providerPath: cwdRelative('providers/b.ts'),
        parseParameters: providers[1]?.parseParameters,
        schemaTransformer: false,
        applicationHooks: [],
        lifecycleHooks: []
      },
      {
        async: false,
        type: 'ProviderD',
        providerPath: cwdRelative('providers/d.ts'),
        parseParameters: providers[2]?.parseParameters,
        schemaTransformer: false,
        applicationHooks: [],
        lifecycleHooks: []
      },
      {
        async: false,
        type: 'ProviderC',
        providerPath: cwdRelative('providers/c.ts'),
        parseParameters: providers[3]?.parseParameters,
        schemaTransformer: false,
        applicationHooks: [],
        lifecycleHooks: []
      }
    ]);
  });

  test('routes were parsed correctly', () => {
    assert.deepStrictEqual(kita.getRoutes(), [
      {
        kind: 'rest',
        url: '/',
        controllerMethod: 'get',
        method: 'GET',
        controllerName: 'IndexController',
        relativePath: cwdRelative('routes/index.ts'),
        parameters: [
          {
            name: 'ProviderParameterParser',
            value: 'param0',
            imports: [{ name: 'ProviderA', path: cwdRelative('providers/a.ts') }],
            schemaTransformer: false,
            providerName: 'ProviderA',
            helper: 'const param0 = ProviderA.default();'
          },
          {
            name: 'ProviderParameterParser',
            value: 'param1',
            imports: [{ name: 'ProviderB', path: cwdRelative('providers/b.ts') }],
            schemaTransformer: false,
            providerName: 'ProviderB',
            helper: 'const param1 = ProviderB.default();'
          }
        ],
        schema: {
          operationId: 'getIndex',
          response: { '2xx': { type: 'number' } }
        }
      },
      {
        kind: 'rest',
        url: '/',
        controllerMethod: 'post',
        method: 'POST',
        controllerName: 'IndexController',
        relativePath: cwdRelative('routes/index.ts'),
        parameters: [
          {
            name: 'ProviderParameterParser',
            value: 'param1',
            imports: [
              { name: 'ProviderC', path: cwdRelative('providers/c.ts') },
              { name: 'ProviderD', path: cwdRelative('providers/d.ts') }
            ],
            schemaTransformer: false,
            providerName: 'ProviderC',
            helper:
              // biome-ignore lint/style/useTemplate: easier to read
              'const param0 = ProviderD.default();;\n' +
              '\n' +
              `     if (${kReplyParam}.sent) {\n` +
              '       return;\n' +
              '     }\n' +
              '\n' +
              'const param1 = ProviderC.default(param0);'
          },
          {
            name: 'ProviderParameterParser',
            value: 'param1',
            imports: [{ name: 'ProviderA', path: cwdRelative('providers/a.ts') }],
            schemaTransformer: false,
            providerName: 'ProviderA',
            helper: 'const param1 = ProviderA.default();'
          }
        ],
        schema: {
          operationId: 'postIndex',
          response: { '2xx': { type: 'number' } }
        }
      }
    ]);
  });
});
