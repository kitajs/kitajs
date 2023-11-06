import http, { IncomingMessage } from 'http';
import assert from 'node:assert';
import path from 'node:path';
import test, { describe } from 'node:test';
import { Worker } from 'worker_threads';
import { createApp, generateRuntime } from '../runner';

//@ts-ignore - first test may not have been run yet
import type Runtime from './runtime';

describe('References', async () => {
  const rt = await generateRuntime<typeof Runtime>(__dirname);

  test('expects doA and B were generated', () => {
    assert.ok(rt);
    assert.ok(rt.doA);
    assert.ok(rt.doB);
    assert.ok(rt.doBAgain);
  });

  test('methods are bound correctly', () => {
    assert.equal(rt.doA(), 'A');
    assert.equal(rt.doB(), 'B');
    assert.deepStrictEqual(rt.doBAgain(), { b: 'B' });
  });

  test('A was generated', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'GET', url: '/a' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'A');
  });

  test('B was generated', async () => {
    await using app = createApp(rt);

    const res = await app.inject({ method: 'GET', url: '/b' });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'B');
  });

  // We redo this test as a worker to ensure that the runtime is being ran correctly
  // and remove all the false positives this test setup runtime may have caused
  // (@swc-node/register, node --test and other possible runtime differences)
  test('B (again) as worker', async () => {
    const worker = new Worker(path.join(__dirname, 'worker.js'));

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
