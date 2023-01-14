import { Kita, filename } from './routes';

import Piscina from 'piscina';
import fastify from 'fastify';

const app = fastify();

app.register(require('@fastify/cookie'));

app.register(require('@fastify/swagger'), {
  openapi: {
    info: {
      title: 'Test swagger',
      description: 'testing the fastify swagger api',
      version: '0.1.0'
    },
    components: {
      securitySchemes: {
        default: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header'
        },
        admin: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header'
        }
      }
    }
  }
});

app.register(require('@fastify/swagger-ui'), {
  routePrefix: '/',
  staticCSP: true,
  transformSpecificationClone: true,
  uiConfig: {
    docExpansion: 'full'
  }
});

app.register(Kita, {
  context: {
    piscina: new Piscina({ filename })
  }
});

app.setErrorHandler((error, request, reply) => {
  console.log(error);
  reply.send(JSON.stringify(error, null, 2));
});

app.listen({ port: 3000 }).then((ip) => console.log(`${ip}/documentation`));
