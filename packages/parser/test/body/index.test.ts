import assert from 'node:assert';
import path from 'node:path';
import test, { describe } from 'node:test';
import { parseRoutes } from '../runner';

describe('Body Parameter', async () => {
  const kita = await parseRoutes(__dirname);

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
      controllerName: 'IndexController',
      controllerPath: path.resolve(__dirname, 'routes/index.ts'),
      controllerPrettyPath: 'test/body/routes/index.ts:8:1',
      parameters: [{ value: 'req.body' }],
      schema: {
        body: { $ref: 'Complex' },
        response: { default: { type: 'number' } },
        operationId: 'postIndex'
      }
    });
  });
});
