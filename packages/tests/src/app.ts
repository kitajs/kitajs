import fastify from 'fastify';

export function createApp(Kita: typeof import('./routes').Kita) {
  const app = fastify();

  app.register(Kita, { context: {} });

  return app;
}
