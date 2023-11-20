import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src/util/paths';
import { parseRoutes } from '../runner';

describe('Providers Registration', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 4 providers were generated', () => {
    assert.equal(kita.getProviderCount(), 4);
    assert.equal(kita.getRouteCount(), 2);
  });

  test('providers were parsed correctly', () => {
    assert.deepStrictEqual(kita.getProviders(), [
      {
        async: false,
        type: 'ProviderA',
        providerPath: cwdRelative('providers/a.ts'),
        parameters: [],
        schemaTransformer: false,
        applicationHooks: [],
        lifecycleHooks: []
      },
      {
        async: false,
        type: 'ProviderB',
        providerPath: cwdRelative('providers/b.ts'),
        parameters: [],
        schemaTransformer: false,
        applicationHooks: [],
        lifecycleHooks: []
      },
      {
        async: false,
        type: 'ProviderD',
        providerPath: cwdRelative('providers/d.ts'),
        parameters: [],
        schemaTransformer: false,
        applicationHooks: [],
        lifecycleHooks: []
      },
      {
        async: false,
        type: 'ProviderC',
        providerPath: cwdRelative('providers/c.ts'),
        parameters: [
          {
            name: 'ProviderParameterParser',
            value: 'param0',
            imports: [{ name: 'ProviderD', path: cwdRelative('providers/d.ts') }],
            schemaTransformer: false,
            providerName: 'ProviderD',
            helper: 'const param0 = ProviderD.default();'
          }
        ],
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
              'const param0 = ProviderD.default();;\n' +
              '\n' +
              '     if (reply.sent) {\n' +
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
