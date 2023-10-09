import assert from 'node:assert';
import test, { describe } from 'node:test';
import { parseRoutes } from '../runner';

describe('Cookies', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 2 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 2);
  });

  test('handle cookie variations', () => {
    const route = kita.getRoute('getIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'IndexController',
      controllerPath: 'routes/index.ts',
      kind: 'rest',
      parameters: [
        { value: 'req.cookies.a', helper: "if (req.cookies.a === undefined) { throw new Error('Missing cookie a') };" },
        {
          value: 'req.cookies["c c"]',
          helper: `if (req.cookies["c c"] === undefined) { throw new Error('Missing cookie c c') };`
        },
        { value: 'req.cookies.d', helper: "if (req.cookies.d === undefined) { throw new Error('Missing cookie d') };" }
      ],
      schema: {
        response: { default: { type: 'string' } },
        operationId: 'getIndex'
      }
    });
  });

  test('cookie default values', () => {
    const route = kita.getRoute('postIndex');

    assert.deepStrictEqual(route, {
      url: '/',
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'IndexController',
      controllerPath: 'routes/index.ts',
      kind: 'rest',
      parameters: [
        { value: 'req.cookies.a', helper: undefined },
        { value: 'req.cookies.b', helper: undefined },
        { value: 'req.cookies.c', helper: "if (req.cookies.c === undefined) { throw new Error('Missing cookie c') };" },
        { value: 'req.cookies.d', helper: undefined }
      ],
      schema: {
        response: { default: { type: 'string' } },
        operationId: 'postIndex'
      }
    });
  });
});
