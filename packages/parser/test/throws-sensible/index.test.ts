import assert from 'node:assert';
import test, { describe } from 'node:test';
import { cwdRelative } from '../../src';
import { parseRoutes } from '../runner';

describe('@throws also registers fastifySensible', async () => {
  const kita = parseRoutes(__dirname);

  test('expects 1 routes were generated', () => {
    assert.equal(kita.getProviderCount(), 0);
    assert.equal(kita.getRouteCount(), 1);
    assert.equal(kita.getPluginCount(), 3);
  });

  test('created fastifySwagger plugin', () => {
    assert.ok(kita.getPlugin('fastifySwagger'));
  });

  test('created fastifyScalarUi plugin', () => {
    assert.ok(kita.getPlugin('fastifyScalarUi'));
  });

  test('created fastifySensible plugin', () => {
    assert.ok(kita.getPlugin('fastifySensible'));
  });

  test('generates throwsInternalServerError', () => {
    const route = kita.getRoute('throwsInternalServerError');

    console.dir(route, { depth: 10 });

    assert.deepStrictEqual(route, {
      kind: 'rest',
      url: '/',
      controllerMethod: 'get',
      method: 'GET',
      relativePath: cwdRelative('routes/index.ts'),
      parameters: [],
      schema: {
        operationId: 'throwsInternalServerError',
        response: { '500': { $ref: 'HttpError' }, '2xx': { type: 'boolean' } }
      }
    });
  });
});
