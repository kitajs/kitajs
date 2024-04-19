import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('Header Parameter', async () => {
  const kita = parseRoutes(__dirname);

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
        relativePath: cwdRelative('routes/index.ts'),
        parameters: [
          { name: 'HeaderParameterParser', value: 'req.headers.name' },
          { name: 'HeaderParameterParser', value: 'req.headers.age' },
          {
            name: 'HeaderParameterParser',
            value: 'req.headers["custom name"]'
          }
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
          response: { '2xx': { type: 'string' } },
          operationId: 'getIndex'
        }
      }
    );
  });
});
