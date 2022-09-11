import { Kita } from './routes';

import fastify from 'fastify';

const app = fastify();

app.register(require('@fastify/cookie'));
app.register(require('@fastify/swagger'), { exposeRoute: true, staticCSP: true });

app.register(Kita, { context: {} });

app.setErrorHandler((error, request, reply) => {
  console.log(error);
  reply.send(JSON.stringify(error, null, 2));
});

app.listen({ port: 3000 }).then((ip) => console.log(`${ip}/documentation`));
