import { Kita } from './routes';

import fastify from 'fastify';

const app = fastify();

app.register(require('@fastify/cookie'));
app.register(require('@fastify/swagger'), { routePrefix: '/docs', exposeRoute: true });

app.register(Kita, { context: {} });

app.listen({ port: 3000 }).then((ip) => console.log(ip));
