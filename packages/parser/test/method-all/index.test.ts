import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Hello World', async () => {
  const kita = await parseRoutes(__dirname);

  test('expects 1 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 1);
    assert.equal(kita.getPluginCount(), 2);
  });

  test('created fastifySwagger plugin', () => {
    assert.ok(kita.getPlugin('fastifySwagger'));
  });

  test('created fastifyScalarUi plugin', () => {
    assert.ok(kita.getPlugin('fastifyScalarUi'));
  });

  test('generates hello world', () => {
    const route = kita.getRoute('allIndex');

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'all',
      method: 'ALL',
      relativePath: cwdRelative('routes/index.ts'),
      parameters: [{ name: 'QueryParameterParser', value: 'req.query.name' }],
      schema: {
        querystring: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: [],
          additionalProperties: undefined
        },
        response: { '2xx': { type: 'string' } },
        operationId: 'allIndex',
        description: 'Hello world API endpoint.'
      }
    });
  });
});
