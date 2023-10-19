import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Http errors', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 2 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 2);
  });

  test('assigns all possible errors', () => {
    const route = kita.getRoute('getIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'IndexController',
      controllerPath: cwdRelative('routes/index.ts'),
      parameters: [{ name: 'ErrorsParameterParser', value: 'req.server.httpErrors' }],
      schema: {
        operationId: 'getIndex',
        response: {
          '409': { $ref: 'HttpError' },
          '424': { $ref: 'HttpError' },
          '502': { $ref: 'HttpError' },
          '503': { $ref: 'HttpError' },
          '2xx': { $ref: 'GetIndexResponse' }
        }
      }
    });
  });

  test('@throws jsdoc also works', () => {
    const route = kita.getRoute('postIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'IndexController',
      controllerPath: cwdRelative('routes/index.ts'),
      parameters: [],
      schema: {
        operationId: 'postIndex',
        response: {
          '403': { $ref: 'HttpError' },
          '404': { $ref: 'HttpError' },
          '405': { $ref: 'HttpError' },
          '406': { $ref: 'HttpError' },
          '2xx': { $ref: 'PostIndexResponse' }
        }
      }
    });
  });
});
