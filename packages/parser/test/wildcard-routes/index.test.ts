import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Wildcard routes', async () => {
  const kita = parseRoutes(__dirname);

  test('expects 1 route were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 1);
    assert.equal(kita.getPluginCount(), 2);
  });

  test('generates wildcard', () => {
    const wildcard = kita.getRoute('getWildcard');

    assert.deepStrictEqual(wildcard, {
      kind: 'rest',
      url: '/*',
      controllerMethod: 'get',
      controllerName: 'WildcardController',
      method: 'GET',
      relativePath: cwdRelative('routes/[...].ts'),
      parameters: [],
      schema: {
        operationId: 'getWildcard',
        response: { '2xx': { type: 'boolean' } }
      }
    });
  });
});
