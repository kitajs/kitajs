import { Kita } from '@kitajs/runtime';
import fastify from 'fastify';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { generateRuntime } from '../runner';

describe('Schemas', async () => {
  const runtime = await generateRuntime<typeof import('./runtime.kita')>(__dirname);

  test('expects getIndex was generated', () => {
    assert.ok(runtime);
    assert.ok(runtime.runtime);
    assert.ok(runtime.getIndex);
  });

  test('methods are bound correctly', () => {
    assert.equal(runtime.getIndex({ name: 'Schema' }), 'Hello Schema!');
  });

  test('schema was generated', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    await app.ready();

    assert.deepStrictEqual(app.getSchema('Data'), {
      $id: 'Data',
      additionalProperties: false,
      properties: { name: { default: 'Schema', type: 'string' } },
      required: ['name'],
      type: 'object'
    });
  });

  test('getIndex options were generated', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'Hello Schema!');
  });
});
