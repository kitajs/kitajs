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
    assert.deepStrictEqual(response.json(), {
      name: 'World',
      message: 'Hello World!'
    });
  });

  test('GET /?name=Kita', async () => {
    await using app = fastify();
    app.register(backendPlugin);

    const response = await app.inject({
      method: 'GET',
      url: '/',
      query: { name: 'Kita' }
    });

    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(response.json(), {
      name: 'Kita',
      message: 'Hello Kita!'
    });
  });
});
