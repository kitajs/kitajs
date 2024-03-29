import fastify from 'fastify';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import backendPlugin from '../src/plugin';

describe('Creates route', () => {
  test('GET /', async () => {
    await using app = fastify();
    app.register(backendPlugin);

    const response = await app.inject({
      method: 'GET',
      url: '/'
    });

    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(response.headers['content-type'], 'text/html; charset=utf-8');
  });
});
