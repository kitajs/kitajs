import assert from 'node:assert';
import test, { describe } from 'node:test';
import { parseRoutes } from '../runner';

describe('Header Parameter', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 1 route was generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 1);
  });

  test('parses header correctly', () => {
    const route = kita.getRoute('getIndex');

    assert.deepStrictEqual(
      route,

      {
        kind: 'rest',
        url: '/',
        controllerMethod: 'get',
        method: 'GET',
        controllerName: 'IndexController',
        controllerPath: './routes/index.ts',
        parameters: [
          { value: 'req.headers.name' },
          { value: 'req.headers.age' },
          { value: 'req.headers["custom name"]' }
        ],
        schema: {
          headers: {
            type: 'object',
            properties: {
              'custom name': { type: 'string' },
              age: { type: 'string' },
              name: { type: 'string' }
            },
            required: ['name', 'age'],
            additionalProperties: undefined
          },
          response: { default: { type: 'string' } },
          operationId: 'getIndex'
        }
      }
    );
  });
});
