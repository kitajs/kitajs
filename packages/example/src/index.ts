import '@kitajs/html/register';

import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { Kita } from '@kitajs/runtime';
import fastify from 'fastify';

const { version } = require('../package.json');

async function main() {
  const app = fastify();

  app.register(fastifySwagger, {
    mode: 'dynamic',
    openapi: {
      info: { title: 'kitajs', version }
    }
  });

  app.register(Kita);

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
  });

  const url = await app.listen({ port: 1227 });

  console.log(`Listening!\n Docs: ${url}/docs\n Frontend: ${url}`);
}

main().catch(console.error);
