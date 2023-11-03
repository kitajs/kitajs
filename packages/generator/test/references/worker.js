globalThis.KITA_PROJECT_ROOT = __dirname;

const fastify = require('fastify');
const { Kita } = require('./runtime');
const worker = require('worker_threads');

if (worker.isMainThread) {
  throw new Error('This file should be run as a worker thread.');
}

const app = fastify();

app.register(Kita);

app.listen().then((url) => {
  // Posts url and waits for a message from the parent thread to close the app.
  worker.parentPort.postMessage(url);
  worker.parentPort.once('message', () => {
    app.close();
  });
});
