import { applyRouter } from './routes';

import fastify from 'fastify';

const app = fastify();

applyRouter(app, {});

app.listen({ port: 3000 });
