import fastifySwagger from '@fastify/swagger';
import assert from 'node:assert';
import test, { describe } from 'node:test';
import { generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import fastify from 'fastify';
import type * as Runtime from './runtime.kita';
describe('Multiple plugin registrations', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects getIndex was generated', () => {
    assert.ok(rt);
    assert.ok(rt.getIndex);
    assert.ok(rt.getIndexHandler);
  });

  test('methods are bound correctly', () => {
    assert.equal(rt.getIndex(), 'Hello World!');
    assert.equal(rt.getIndex('Arthur'), 'Hello Arthur!');
  });

  test('getIndex options were generated', async () => {
    await using app = fastify();

    app.register(fastifySwagger);

    // If the plugin does not check for previously registered plugins,
    // this should throw an error
    app.register(rt.Kita);

    const res = await app.inject({ method: 'GET', url: '/' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'Hello World!');
  });
});
