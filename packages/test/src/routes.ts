
import '@fastify/cookie';
import type { FastifyInstance } from 'fastify';

import * as ABCDController from './api/a/b/c/d';
import * as IndexController from './api/index';

export function applyRouter(app: FastifyInstance, context: KitaContext) {
  app.all('/a/b/c/d', async (req, reply) => {
    const response = await ABCDController.all.call(
      context,

      (req.params as any)['asd'],
      req.body as any,
      (req.body as any)['asd']?.['asd']?.['asd'],
      req.query as any,
      (req.query as any)['asd'],
      req.headers['cache-control'] as string || '',
      (req.cookies as any)['auth'],
      req,
      reply
    );

    return reply.send(response);
  });

 app.get('/', async (req, reply) => {
    const response = await IndexController.get.call(
      context,

      (req.params as any)['asd'],
      (req.query as any)['asd'],
      req,
      reply,
      req.headers['cache-control'] as string || '',
      (req.cookies as any)['auth'],
      req.body as any,
      (req.body as any)['asd']?.['asd']?.['asd'],
      req.query as any
    );

    return reply.send(response);
  });
}
