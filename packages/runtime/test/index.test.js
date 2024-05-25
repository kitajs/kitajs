const { test, describe } = require('node:test');
const assert = require('node:assert');
const runtime = require('../index.js');
const fastify = require('fastify');
const fp = require('fastify-plugin');

describe('Runtime tests', () => {
  test('Only exports Kita function', () => {
    assert.equal(typeof runtime, 'object');
    assert.equal(typeof runtime.Kita, 'function');
  });

  test('Plugin registers everything', async () => {
    const app = fastify();

    const options = {
      applicationHooks: [['onRequest', async () => {}]],
      plugins: {
        fastifyCookie: '@fastify/cookie'
      },
      routes: [
        {
          method: 'GET',
          url: '/',
          handler: async () => ({ a: 1 })
        }
      ],
      schemas: [
        {
          $id: 'test',
          type: 'object',
          properties: {
            test: {
              type: 'string'
            }
          }
        }
      ]
    };

    await app.register(runtime.Kita, {
      runtime: Promise.resolve({ runtime: options }),
      plugins: {
        tst: { a: 2 }
      }
    });

    await app.ready();

    assert.deepStrictEqual((await app.inject({ path: '/' })).json(), { a: 1 });
    assert.deepStrictEqual(app.hasPlugin('@fastify/cookie'), true);
    assert.deepStrictEqual(app.getSchemas(), {
      [`${options.schemas[0].$id}`]: options.schemas[0]
    });

    await app.close();
  });
});
