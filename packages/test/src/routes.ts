
import '@fastify/cookie';

import type { RouteContext, ProvidedRouteContext } from '@kita/runtime';
import { RouterUtils } from '@kita/runtime';
import type { FastifyInstance } from 'fastify';
import Config from './kita';

import * as BodyController from './api/body';
import * as Hello$nameController from './api/hello/[name]';
import * as HelloQueryController from './api/hello/query';

export function applyRouter(app: FastifyInstance, providedContext: ProvidedRouteContext) {
  const context: RouteContext = {
    ...providedContext,
    kita: Config,
    config: {"tsconfig":"./tsconfig.json","runtimeConfig":"./kita","controllers":{"glob":["src/api/**/*.ts","api/**/*.ts"]},"routes":{"output":"./src/routes.ts","template":"@kita/core/templates/default.hbs"}},
  };

  app.post('/body', { schema: {"body":{"$schema":"http://json-schema.org/draft-07/schema#","$ref":"#/definitions/def-structure--105-113--99-114--93-114--51-163--0-164","definitions":{"def-structure--105-113--99-114--93-114--51-163--0-164":{"type":"object","properties":{"a":{"type":"number","const":1}},"required":["a"],"additionalProperties":false}}}} }, async (req, reply) => {
    const promise = BodyController.post.call(
      context,
      req.body as any
    );

    return RouterUtils.sendResponse.call(context, req, reply, promise);
  });

 app.get('/hello/:name', { schema: {} }, async (req, reply) => {
    const promise = Hello$nameController.get.call(
      context,
      (req.params as any)['name']
    );

    return RouterUtils.sendResponse.call(context, req, reply, promise);
  });

 app.post('/hello/query', { schema: {"querystring":{"$schema":"http://json-schema.org/draft-07/schema#","$ref":"#/definitions/def-structure--368-383--361-384--351-384--92-509--0-510","definitions":{"def-structure--368-383--361-384--351-384--92-509--0-510":{"type":"object","properties":{"age":{"type":"number"}},"required":["age"],"additionalProperties":false}},"properties":{"name":{"$schema":"http://json-schema.org/draft-07/schema#","$ref":"#/definitions/def-%22name%22","definitions":{"def-\"name\"":{"type":"string","const":"name"}}}}}} }, async (req, reply) => {
    const promise = HelloQueryController.post.call(
      context,
      req.query as any,
      (req.query as any)['name'],
      Config.parameterResolvers.AuthParam.apply(context, [req, reply, []])
    );

    return RouterUtils.sendResponse.call(context, req, reply, promise);
  });
}
