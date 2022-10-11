import type { RouteContext, ProvidedRouteContext } from '@kitajs/runtime';
import fp from 'fastify-plugin';
import '@fastify/swagger';
import * as ReqRepController from './routes/req-rep';

/**
 * This is the resolved config that was used during code generation. JIC its needed at runtime.
 */
export const config = {
  params: {},
  tsconfig: './tsconfig.json',
  controllers: {
    glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
    prefix: '(?:.*src)?/?(?:routes/?)'
  },
  routes: { output: './src/routes.ts', format: { parser: 'typescript' } }
};

/**
 * The Kita generated fastify plugin. Registering it into your fastify instance will
 * automatically register all routes, schemas and controllers.
 *
 * @example
 * ```ts
 * import { Kita } from './routes'; // this file
 * import app from './fastify-app';
 *
 * app.register(Kita, { context: { ... } })
 * ```
 */
export const Kita = fp<{ context: ProvidedRouteContext }>((fastify, options) => {
  const context: RouteContext = { config, fastify, ...options.context };

  fastify.addSchema({
    $id: 'ReqRepControllerPostResponse',
    type: 'null'
  });

  fastify.route({
    method: 'GET',
    url: '/req-rep',
    schema: {
      operationId: 'ReqRepControllerGet',
      response: { default: { type: 'string' } }
    },
    //@ts-ignore - we may have unused params
    handler: async (request, reply) => {
      const data = await ReqRepController.get.apply(context, [request, reply]);

      if (reply.sent) {
        //@ts-ignore - When ReqRepController.get() returns nothing, typescript gets mad.
        if (data) {
          const error = new Error('Reply already sent, but controller returned data');

          //@ts-expect-error - include data in error to help debugging
          error.data = data;

          return error;
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'POST',
    url: '/req-rep',
    schema: {
      operationId: 'ReqRepControllerPost',
      response: { default: { $ref: 'ReqRepControllerPostResponse' } }
    },
    //@ts-ignore - we may have unused params
    handler: async (request, reply) => {
      const data = await ReqRepController.post.apply(context, [reply]);

      if (reply.sent) {
        //@ts-ignore - When ReqRepController.post() returns nothing, typescript gets mad.
        if (data) {
          const error = new Error('Reply already sent, but controller returned data');

          //@ts-expect-error - include data in error to help debugging
          error.data = data;

          return error;
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'PUT',
    url: '/req-rep',
    schema: {
      operationId: 'ReqRepControllerPut',
      response: { default: { type: 'string' } }
    },
    //@ts-ignore - we may have unused params
    handler: async (request, reply) => {
      const data = await ReqRepController.put.apply(context, [reply]);

      if (reply.sent) {
        //@ts-ignore - When ReqRepController.put() returns nothing, typescript gets mad.
        if (data) {
          const error = new Error('Reply already sent, but controller returned data');

          //@ts-expect-error - include data in error to help debugging
          error.data = data;

          return error;
        }

        return;
      }

      return data;
    }
  });

  // Ensure this function remains a "async" function
  return Promise.resolve();
});

/**
 * The extracted data from your controllers and configurations for this template hydration. It is here just for debugging purposes.
 */
export const HBS_CONF = {
  config: {
    params: {},
    tsconfig: './tsconfig.json',
    controllers: {
      glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
      prefix: '(?:.*src)?/?(?:routes/?)'
    },
    routes: { output: './src/routes.ts', format: { parser: 'typescript' } }
  },
  routes: [
    {
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'ReqRepController',
      url: '/req-rep',
      controllerPath: 'src/routes/req-rep.ts:3:15',
      parameters: [{ value: 'request' }, { value: 'reply' }],
      schema: {
        operationId: 'ReqRepControllerGet',
        response: { default: { type: 'string' } }
      },
      rendered:
        'fastify.route({\n  method: \'GET\',\n  url: \'/req-rep\',\n  schema: {"operationId":"ReqRepControllerGet","response":{"default":{"type":"string"}}},\n  //@ts-ignore - we may have unused params\n  handler: async (request, reply) => {\n\n    const data = await ReqRepController.get.apply(context, [request,reply]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ReqRepController.get() returns nothing, typescript gets mad.\n      if (data) {\n        const error = new Error(\'Reply already sent, but controller returned data\');\n    \n        //@ts-expect-error - include data in error to help debugging\n        error.data = data;\n        \n        return error;\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    },
    {
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'ReqRepController',
      url: '/req-rep',
      controllerPath: 'src/routes/req-rep.ts:8:15',
      parameters: [{ value: 'reply' }],
      schema: {
        operationId: 'ReqRepControllerPost',
        response: { default: { $ref: 'ReqRepControllerPostResponse' } }
      },
      rendered:
        'fastify.route({\n  method: \'POST\',\n  url: \'/req-rep\',\n  schema: {"operationId":"ReqRepControllerPost","response":{"default":{"$ref":"ReqRepControllerPostResponse"}}},\n  //@ts-ignore - we may have unused params\n  handler: async (request, reply) => {\n\n    const data = await ReqRepController.post.apply(context, [reply]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ReqRepController.post() returns nothing, typescript gets mad.\n      if (data) {\n        const error = new Error(\'Reply already sent, but controller returned data\');\n    \n        //@ts-expect-error - include data in error to help debugging\n        error.data = data;\n        \n        return error;\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    },
    {
      controllerMethod: 'put',
      method: 'PUT',
      controllerName: 'ReqRepController',
      url: '/req-rep',
      controllerPath: 'src/routes/req-rep.ts:12:15',
      parameters: [{ value: 'reply' }],
      schema: {
        operationId: 'ReqRepControllerPut',
        response: { default: { type: 'string' } }
      },
      rendered:
        'fastify.route({\n  method: \'PUT\',\n  url: \'/req-rep\',\n  schema: {"operationId":"ReqRepControllerPut","response":{"default":{"type":"string"}}},\n  //@ts-ignore - we may have unused params\n  handler: async (request, reply) => {\n\n    const data = await ReqRepController.put.apply(context, [reply]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ReqRepController.put() returns nothing, typescript gets mad.\n      if (data) {\n        const error = new Error(\'Reply already sent, but controller returned data\');\n    \n        //@ts-expect-error - include data in error to help debugging\n        error.data = data;\n        \n        return error;\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    }
  ],
  schemas: [{ $id: 'ReqRepControllerPostResponse', type: 'null' }],
  imports: ["import * as ReqRepController from './routes/req-rep';"]
};
