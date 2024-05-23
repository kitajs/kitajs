const { test, describe } = require('node:test');
const assert = require('node:assert');
const runtime = require('../index.js');
const fastify = require('fastify');
const fp = require('fastify-plugin');

describe('Runtime tests', () => {
  test('Only exports Kita function', () => {
    assert.equal(typeof runtime, 'object');
    assert.deepEqual(Object.keys(runtime), ['Kita']);
  });

  test('Plugin registers everything', async () => {
    const app = fastify();

    const options = {
      applicationHooks: [['onRequest', async () => {}]],
      plugins: {
        tst: [
          fp(
            async (_, opts) => {
              assert.deepStrictEqual(opts, { a: 2 });
            },
            { name: 'tst' }
          ),
          { a: 1 }
        ]
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
    assert.deepStrictEqual(app.hasPlugin('tst'), true);
    assert.deepStrictEqual(app.getSchemas(), {
      [`${options.schemas[0].$id}`]: options.schemas[0]
    });

    await app.close();
  });
});
