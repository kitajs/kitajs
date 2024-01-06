import assert from 'node:assert';
import test, { describe } from 'node:test';
import { parseRoutes } from '../runner';

describe('Hello World', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 1 provider was generated', () => {
    assert.equal(kita.getProviderCount(), 1);
    assert.equal(kita.getRouteCount(), 0);
    assert.equal(kita.getPluginCount(), 0);
  });
});
