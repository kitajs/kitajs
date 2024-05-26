import { ajvFilePlugin } from '@fastify/multipart';
import closeWithGrace from 'close-with-grace';
import fastify from 'fastify';
import { isMainThread } from 'node:worker_threads';
import { backendPlugin } from './plugin';
import { Env } from './util/environment';

// Ensures this is the start script
if (Env.ENV === 'test' || !isMainThread) {
  throw new Error('This file should not be executed in test context or worker thread.');
}

const app = fastify({
  logger: { level: Env.LOG_LEVEL },
  ajv: { plugins: [ajvFilePlugin] }
});

// Registers our backend
app.register(backendPlugin);

// Registers the close listener to shutdown gracefully
const closeListeners = closeWithGrace(async ({ err }) => {
  if (err) {
    app.log.error(err);
  }

  await app.close();
});

// Cancelling the close listeners
app.addHook('onClose', async () => {
  closeListeners.uninstall();
});

// Starts the server
app.listen({ port: Env.PORT, host: Env.HOST });
