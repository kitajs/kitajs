import './prelude';

import fastifyHelmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import fastifyUnderPressure from '@fastify/under-pressure';
import { Kita } from '@kitajs/runtime';
import fp from 'fastify-plugin';
import path from 'node:path';

export default fp(async (app) => {
  // Registers the generated kita plugin
  app.register(Kita);

  // Measures process load with automatic handling of "Service Unavailable"
  app.register(fastifyUnderPressure, {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 1000000000,
    maxRssBytes: 1000000000,
    maxEventLoopUtilization: 0.98
  });

  // Important security headers for Fastify
  app.register(fastifyHelmet, {
    global: true,
    // The Suspense component uses inline <script> tags
    contentSecurityPolicy: false
  });

  // Serves static files from the public directory
  app.register(fastifyStatic, {
    root: path.resolve('public')
  });

  // Add your custom stuff here
  // app.register(myPlugin)
  // ...
});
