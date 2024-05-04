import { Kita } from '@kitajs/runtime';
import fastify from 'fastify';
import worker from 'node:worker_threads';

if (worker.isMainThread) {
  throw new Error('This file should be run as a worker thread.');
}

const app = fastify();

app.register(Kita, {
  runtime: import('./runtime.kita')
});

app.listen().then((url) => {
  // Posts url and waits for a message from the parent thread to close the app.
  worker.parentPort!.postMessage(url);
  worker.parentPort!.once('message', () => {
    app.close();
  });
});
