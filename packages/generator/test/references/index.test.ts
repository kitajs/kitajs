import { Kita } from '@kitajs/runtime';
import fastify from 'fastify';
import assert from 'node:assert';
import http, { type IncomingMessage } from 'node:http';
import path from 'node:path';
import test, { describe } from 'node:test';
import { Worker } from 'node:worker_threads';
import { generateRuntime } from '../runner';

describe('References', async () => {
  const runtime = await generateRuntime<typeof import('./runtime.kita')>(__dirname);

  test('expects doA and B were generated', () => {
    assert.ok(runtime);
    assert.ok(runtime.runtime);
    assert.ok(runtime.doA);
    assert.ok(runtime.doB);
    assert.ok(runtime.doBAgain);
  });

  test('methods are bound correctly', () => {
    assert.equal(runtime.doA(), 'A');
    assert.equal(runtime.doB(), 'B');
    assert.deepStrictEqual(runtime.doBAgain(), { b: 'B' });
  });

  test('A was generated', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({ method: 'GET', url: '/a' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'A');
  });

  test('B was generated', async () => {
    await using app = fastify();
    await app.register(Kita, { runtime });

    const res = await app.inject({ method: 'GET', url: '/b' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'B');
  });

  // We redo this test as a worker to ensure that the runtime is being ran correctly
  // and remove all the false positives this test setup runtime may have caused
  // (@swc-node/register, node --test and other possible runtime differences)
  test('B (again) as worker', async () => {
    const worker = new Worker(path.join(__dirname, 'worker.ts'));

    // waits for worker to start
    const url = await new Promise<string>((res) => worker.once('message', res));
    const response = await new Promise<IncomingMessage>((res) => http.get(url, { path: '/b-again' }, res));

    let data = '';
    for await (const txt of response) {
      data += txt;
    }

    assert.deepStrictEqual(JSON.parse(data), { b: 'B' });

    // wait for worker to exit
    worker.postMessage('close');
    await await new Promise((res) => worker.once('exit', res));
  });
});
