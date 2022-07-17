import '@fastify/cookie';
import type { FastifyInstance } from 'fastify';

import * as BodyController from './api/body';
import * as Hello$nameController from './api/hello/[name]';
import * as HelloQueryController from './api/hello/query';

export function applyRouter(app: FastifyInstance, context: KitaContext) {
  app.post(
    '/body',
    {
      schema: {
        body: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          $ref: '#/definitions/def-structure--90-98--84-99--78-99--37-148--0-149',
          definitions: {
            'def-structure--90-98--84-99--78-99--37-148--0-149': {
              type: 'object',
              properties: {
                a: {
                  type: 'number',
                  const: 1
                }
              },
              required: ['a'],
              additionalProperties: false
            }
          },
        },
      }
    },
    async (req, reply) => {
      const response = await BodyController.post.call(
        context,

        req.body as any
      );

      return reply.send(response);
    }
  );

  app.get('/hello/:name', { schema: {} }, async (req, reply) => {
    const response = await Hello$nameController.get.call(
      context,

      (req.params as any)['name']
    );

    return reply.send(response);
  });

  app.get('/hello/query', { schema: {} }, async (req, reply) => {
    const response = await HelloQueryController.get.call(
      context,

      (req.query as any)['name'],
      req.query as any
    );

    return reply.send(response);
  });
}
