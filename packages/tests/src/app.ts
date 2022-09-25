import fastify from 'fastify';
import { Kita } from './routes';

export const app = fastify();

app.register(Kita, { context: {} });
