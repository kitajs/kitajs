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
        schemaTransformer: false
      },
      {
        async: false,
        type: 'ProviderB',
        providerPath: cwdRelative('providers/b.ts'),
        parameters: [],
        schemaTransformer: false
      },
      {
        async: false,
        type: 'ProviderD',
        providerPath: cwdRelative('providers/d.ts'),
        parameters: [],
        schemaTransformer: false
      },
      {
        async: false,
        type: 'ProviderC',
        providerPath: cwdRelative('providers/c.ts'),
        parameters: [
          {
            name: 'ProviderParameterParser',
            value: 'param0',
            imports: [{ name: 'Resolver0', path: cwdRelative('providers/d.ts') }],
            schemaTransformer: false,
            providerName: 'Resolver0',
            helper: 'const param0 = Resolver0();'
          }
        ],
        schemaTransformer: false
      }
    ]);
  });

  test('routes were parsed correctly', () => {
    return assert.deepStrictEqual(kita.getRoutes(), [
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
            imports: [{ name: 'Resolver0', path: cwdRelative('providers/a.ts') }],
            schemaTransformer: false,
            providerName: 'Resolver0',
            helper: 'const param0 = Resolver0();'
          },
          {
            name: 'ProviderParameterParser',
            value: 'param1',
            imports: [{ name: 'Resolver1', path: cwdRelative('providers/b.ts') }],
            schemaTransformer: false,
            providerName: 'Resolver1',
            helper: 'const param1 = Resolver1();'
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
            value: 'param0',
            imports: [{ name: 'Resolver0', path: cwdRelative('providers/c.ts') }],
            schemaTransformer: false,
            providerName: 'Resolver0',
            helper:
              'const param0 = Resolver0();;\n' +
              '\n' +
              '     if (reply.sent) {\n' +
              '       return;\n' +
              '     }\n' +
              '\n' +
              'const param0 = Resolver0(param0);'
          },
          {
            name: 'ProviderParameterParser',
            value: 'param1',
            imports: [{ name: 'Resolver1', path: cwdRelative('providers/a.ts') }],
            schemaTransformer: false,
            providerName: 'Resolver1',
            helper: 'const param1 = Resolver1();'
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
