import '@fastify/cookie';

import type { RouteContext, ProvidedRouteContext } from '@kita/runtime';
import { RouterUtils } from '@kita/runtime';
import type { FastifyInstance } from 'fastify';

import * as BodyController from './api/body';
import * as Hello$nameController from './api/hello/[name]/index';
import * as HelloQueryController from './api/hello/query';

import AuthParamResolver from './params/auth';

export function applyRouter(app: FastifyInstance, providedContext: ProvidedRouteContext) {
  const context: RouteContext = {
    ...providedContext,
    config: {
      tsconfig: './tsconfig.json',
      params: { AuthParam: './src/params/auth' },
      controllers: { glob: ['src/api/**/*.ts', 'api/**/*.ts'] },
      routes: { output: './src/routes.ts', template: '@kita/core/templates/default.hbs' }
    }
  };

  app.post(
    '/body',
    {
      schema: {
        body: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          $ref: '#/definitions/def-structure--105-113--99-114--93-114--51-163--0-164',
          definitions: {
            'def-structure--105-113--99-114--93-114--51-163--0-164': {
              type: 'object',
              properties: { a: { type: 'number', const: 1 } },
              required: ['a'],
              additionalProperties: false
            }
          }
        }
      }
    },
    async (req, reply) => {
      const promise = BodyController.post.call(context, req.body as any);

      return RouterUtils.sendResponse.call(context, req, reply, promise);
    }
  );

  app.get('/hello/:name/', { schema: {} }, async (req, reply) => {
    const promise = Hello$nameController.get.call(context, (req.params as any)['name']);

    return RouterUtils.sendResponse.call(context, req, reply, promise);
  });

  app.get(
    '/hello/query',
    {
      schema: {
        querystring: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          $ref: '#/definitions/def-structure--166-181--159-182--149-182--99-343--0-344',
          definitions: {
            'def-structure--166-181--159-182--149-182--99-343--0-344': {
              type: 'object',
              properties: { age: { type: 'number' } },
              required: ['age'],
              additionalProperties: false
            }
          },
          properties: {
            name: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              $ref: '#/definitions/def-%22name%22',
              definitions: { 'def-"name"': { type: 'string', const: 'name' } }
            }
          }
        }
      }
    },
    async (req, reply) => {
      const custom = await AuthParamResolver.call(context, req, reply, ['jwt']);

      if (reply.sent) {
        return undefined as any;
      }

      const promise = HelloQueryController.get.call(
        context,
        req.query as any,
        (req.query as any)['name'],
        custom
      );

      return RouterUtils.sendResponse.call(context, req, reply, promise);
    }
  );
}
