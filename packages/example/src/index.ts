import { Kita } from '@kitajs/runtime';
import fastify from 'fastify';

const { version } = require('../package.json');

async function main() {
  const app = fastify({
    logger: true
  });

  app.register(await import('@fastify/swagger'), {
    mode: 'dynamic',
    openapi: {
      info: {
        title: 'KitaJS Swagger Example',
        description: 'Performant and type safe fastify router - Build fast end-to-end APIs with ZERO abstraction cost!',
        version
      }
    }
  });

  app.register(await import('@fastify/swagger-ui'), {
    routePrefix: '/docs'
  });

  app.register(Kita);

  await app.listen({ port: 1227 });

  console.log(`Listening on http://localhost:1227/docs`);
}

main().catch(console.error);
