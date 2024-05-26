import fastifyHelmet from '@fastify/helmet';
import fastifyUnderPressure from '@fastify/under-pressure';
import { Kita, KitaSwagger } from '@kitajs/runtime';
import fp from 'fastify-plugin';
import { Env } from './util/environment';

export const backendPlugin = fp(async (app) => {
  // Measures process load with automatic handling of "Service Unavailable"
  if (Env.ENV === 'production') {
    await app.register(fastifyUnderPressure, {
      maxEventLoopDelay: 1000,
      maxHeapUsedBytes: 100000000,
      maxRssBytes: 100000000,
      maxEventLoopUtilization: 0.98
    });
  }

  // Important security headers for Fastify
  await app.register(fastifyHelmet, {
    global: true
  });

  // Registers the generated kita plugin
  await app.register(Kita, {
    runtime: import('./runtime.kita')
    // You can further configure the plugins here
    // plugins: {}
  });

  // Serve the openapi.json file to be used by other tools
  await app.register(KitaSwagger);

  // Add your custom stuff here
  // await app.register(myPlugin)
  // ...
});
