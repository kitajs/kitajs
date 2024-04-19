import './prelude';

import fastifyHelmet from '@fastify/helmet';
import fastifyUnderPressure from '@fastify/under-pressure';
import { Kita } from '@kitajs/runtime';
import fp from 'fastify-plugin';

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
    global: true
  });

  // Add your custom stuff here
  // app.register(myPlugin)
  // ...
});
