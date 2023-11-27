import assert from 'node:assert';
import test, { describe } from 'node:test';
import { HttpMethods } from '../../src/util/http';
import { parseRoutes } from '../runner';

describe('Http Methods', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 16 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 16);
    assert.equal(kita.getPluginCount(), 2);
  });

  test('generates all methods', async (t) => {
    for (const method of HttpMethods) {
      await t.test(method, () => assert.ok(kita.getRoute(method.toLowerCase() + 'Index')));
    }
  });
});
