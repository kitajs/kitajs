import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Body Parameter', async () => {
  const kita = parseRoutes(__dirname);

  test('expects 1 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 1);
  });

  test('works with Body', () => {
    const route = kita.getRoute('postIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      relativePath: cwdRelative('routes/index.ts'),
      parameters: [{ name: 'BodyParameterParser', value: 'req.body' }],
      schema: {
        body: { $ref: 'Complex' },
        response: { '2xx': { type: 'number' } },
        operationId: 'postIndex'
      }
    });
  });
});
