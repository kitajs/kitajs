import { ajvFilePlugin } from '@fastify/multipart';
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

fastify({
  logger: { transport: { target: 'pino-pretty' } },
  ajv: { plugins: [ajvFilePlugin] }
})
  // Registers our backend
  .register(backendPlugin)
  // Starts the server
  .listen({
    port: +process.env.PORT,
    host: process.env.HOST || ''
  });
