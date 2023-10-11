import assert from 'node:assert';
import test, { describe } from 'node:test';
import { parseRoutes } from '../runner';

describe('Http errors', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 1 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 1);
  });

  test('assigns all possible errors', () => {
    const route = kita.getRoute('getIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'IndexController',
      controllerPath: './routes/index.ts',
      parameters: [{ value: 'req.server.httpErrors' }],
      schema: {
        operationId: 'getIndex',
        response: {
          '409': { $ref: 'HttpError' },
          '424': { $ref: 'HttpError' },
          '502': { $ref: 'HttpError' },
          '503': { $ref: 'HttpError' },
          '2xx': { $ref: 'getIndexResponse' }
        }
      }
    });
  });
});
