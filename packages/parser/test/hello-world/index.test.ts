import assert from 'node:assert';
import test, { describe } from 'node:test';
import path from 'path';
import { parseRoutes } from '../runner';

describe('Hello World', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 1 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 1);
  });

  test('generates hello world', () => {
    const route = kita.getRoute('getIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'IndexController',
      controllerPath: path.resolve(__dirname, 'routes/index.ts'),
      controllerPrettyPath: 'test/hello-world/routes/index.ts:9:1',
      parameters: [{ value: 'req.query.name' }],
      schema: {
        querystring: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: [],
          additionalProperties: undefined
        },
        response: { default: { type: 'string' } },
        operationId: 'getIndex',
        description:
          'Hello world API endpoint. This comment will be used as the swagger description.\n' +
          '\n' +
          'The name parameter is going to be runtime validated and extract from que query string. If the name is not provided,\n' +
          'the default value will be used.'
      }
    });
  });
});
