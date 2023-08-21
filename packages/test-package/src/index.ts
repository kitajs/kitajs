import { filename, Kita } from './routes';

import fastify from 'fastify';
import Piscina from 'piscina';

const app = fastify({
  ajv: {
    customOptions: {
      allowUnionTypes: true
    }
  }
});

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

app.decorate();

app.register(require('@fastify/swagger-ui'), {
  routePrefix: '/',
  staticCSP: true,
  transformSpecificationClone: true,
  uiConfig: {
    docExpansion: 'full'
  },
  prefix: '/'
});

app.register(Kita, {
  piscina: new Piscina({ filename })
});

app.setErrorHandler((error, request, reply) => {
  console.log(error);
  reply.send(JSON.stringify(error, null, 2));
});

app.listen({ port: 3000 }).then((ip) => console.log(`${ip}/documentation`));
