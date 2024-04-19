import { ajvFilePlugin } from '@fastify/multipart';
import closeWithGrace from 'close-with-grace';
import fastify from 'fastify';
import { isMainThread } from 'node:worker_threads';
import backendPlugin from './plugin';

// Ensures this file is not executed in test context
if (process.env.NODE_TEST_CONTEXT) {
  throw new Error('This file should not be executed in test context');
}

// Ensures this file is not executed in worker context
if (!isMainThread) {
  throw new Error('This file should not be executed in worker context');
}

// Ensures PORT are set
if (!process.env.PORT) {
  throw new Error('PORT must be set');
}

const app = fastify({
  logger: { level: process.env.LOG_LEVEL || 'trace' },
  ajv: { plugins: [ajvFilePlugin] }
});

// Registers our backend
app.register(backendPlugin);

// Starts the server
app.listen({
  port: +process.env.PORT,
  host: process.env.HOST || ''
});

// Delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace({ delay: 500 }, async ({ err }) => {
  if (err) {
    app.log.error(err);
  }

  await app.close();
});

// Cancelling the close listeners
app.addHook('onClose', async () => {
  closeListeners.uninstall();
});
