import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Providers', async () => {
  const kita = parseRoutes(__dirname);

  test('expects 2 route was generated', () => {
    assert.equal(kita.getProviderCount(), 4);
    assert.equal(kita.getRouteCount(), 0);
  });

  test('Application hook', () => {
    const provider = kita.getProvider('H1');

    assert.deepStrictEqual(provider, {
      async: false,
      type: 'H1',
      providerPath: cwdRelative('providers/application.ts'),
      parseParameters: provider?.parseParameters,
      schemaTransformer: false,
      applicationHooks: ['onReady'],
      lifecycleHooks: []
    });
  });

  test('Lifecycle hook', () => {
    const provider = kita.getProvider('H2');

    assert.deepStrictEqual(provider, {
      async: false,
      type: 'H2',
      providerPath: cwdRelative('providers/lifecycle.ts'),
      parseParameters: provider?.parseParameters,
      schemaTransformer: false,
      applicationHooks: [],
      lifecycleHooks: ['onRequest']
    });
  });

  test('Application and Lifecycle hook', () => {
    const provider = kita.getProvider('H3');

    assert.deepStrictEqual(provider, {
      async: false,
      type: 'H3',
      providerPath: cwdRelative('providers/mix.ts'),
      parseParameters: provider?.parseParameters,
      schemaTransformer: false,
      applicationHooks: ['onReady'],
      lifecycleHooks: ['onRequest']
    });
  });

  test('No hook', () => {
    const provider = kita.getProvider('H4');

    assert.deepStrictEqual(provider, {
      async: false,
      type: 'H4',
      providerPath: cwdRelative('providers/none.ts'),
      parseParameters: provider?.parseParameters,
      schemaTransformer: false,
      applicationHooks: [],
      lifecycleHooks: []
    });
  });
});
