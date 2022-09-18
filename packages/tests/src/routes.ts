import type { RouteContext, ProvidedRouteContext } from '@kitajs/runtime';
import fp from 'fastify-plugin';
import '@fastify/swagger';
import * as ParametersReqRepController from './routes/parameters/req-rep';

/** The resultant config read from your kita config file. */
export const KitaConfig = {
  params: {},
  tsconfig: './tsconfig.json',
  controllers: {
    glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
    prefix: '(?:.*src)?/?(?:routes/?)'
  },
  routes: { output: './src/routes.ts', format: { parser: 'typescript' } }
};

/** The fastify plugin to be registered. */
export const Kita = fp<{ context: ProvidedRouteContext }>((fastify, options) => {
  const context: RouteContext = {
    config: KitaConfig,
    fastify,
    ...options.context
  };

  fastify.addSchema({
    $id: 'ParametersReqRepController.postResponse',
    type: 'null'
  });

  fastify.addSchema({
    $id: 'ParametersReqRepController.putResponse',
    type: 'null'
  });

  fastify.addSchema({
    $id: 'ParametersReqRepController.DeleteResponse',
    type: 'string'
  });

  fastify.addSchema({
    $id: 'ParametersReqRepController.getResponse',
    type: 'string'
  });

  fastify.route({
    method: 'GET',
    url: '/parameters/req-rep',
    schema: {
      operationId: 'ParametersReqRepController.get',
      response: {
        default: { $ref: 'ParametersReqRepController.getResponse' }
      }
    },
    //@ts-ignore - unused
    handler: async (request, reply) => {
      const data = await ParametersReqRepController.get.apply(context, [request, reply]);

      if (reply.sent) {
        //@ts-ignore - When ParametersReqRepController.get() returns nothing, typescript gets mad.
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
    url: '/parameters/req-rep',
    schema: {
      operationId: 'ParametersReqRepController.post',
      response: {
        default: { $ref: 'ParametersReqRepController.postResponse' }
      }
    },
    //@ts-ignore - unused
    handler: async (request, reply) => {
      const data = await ParametersReqRepController.post.apply(context, [reply]);

      if (reply.sent) {
        //@ts-ignore - When ParametersReqRepController.post() returns nothing, typescript gets mad.
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
    url: '/parameters/req-rep',
    schema: {
      operationId: 'ParametersReqRepController.put',
      response: {
        default: { $ref: 'ParametersReqRepController.putResponse' }
      }
    },
    //@ts-ignore - unused
    handler: async (request, reply) => {
      const data = await ParametersReqRepController.put.apply(context, [reply]);

      if (reply.sent) {
        //@ts-ignore - When ParametersReqRepController.put() returns nothing, typescript gets mad.
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
    method: 'DELETE',
    url: '/parameters/req-rep',
    schema: {
      operationId: 'ParametersReqRepController.Delete',
      response: {
        default: { $ref: 'ParametersReqRepController.DeleteResponse' }
      }
    },
    //@ts-ignore - unused
    handler: async (request, reply) => {
      const data = await ParametersReqRepController.Delete.apply(context, [reply]);

      if (reply.sent) {
        //@ts-ignore - When ParametersReqRepController.Delete() returns nothing, typescript gets mad.
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

/** Handlebars data for hydration, just for debugging purposes. */
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
      controllerName: 'ParametersReqRepController',
      url: '/parameters/req-rep',
      controllerPath: 'src/routes/parameters/req-rep.ts:3:15',
      parameters: [{ value: 'request' }, { value: 'reply' }],
      schema: {
        operationId: 'ParametersReqRepController.get',
        response: {
          default: { $ref: 'ParametersReqRepController.getResponse' }
        }
      },
      rendered:
        'fastify.route({\n  method: \'GET\',\n  url: \'/parameters/req-rep\',\n  schema: {"operationId":"ParametersReqRepController.get","response":{"default":{"$ref":"ParametersReqRepController.getResponse"}}},\n  //@ts-ignore - unused\n  handler: async (request, reply) => {\n\n    const data = await ParametersReqRepController.get.apply(context, [request,reply]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ParametersReqRepController.get() returns nothing, typescript gets mad.\n      if (data) {\n        const error = new Error(\'Reply already sent, but controller returned data\');\n    \n        //@ts-expect-error - include data in error to help debugging\n        error.data = data;\n        \n        return error;\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    },
    {
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'ParametersReqRepController',
      url: '/parameters/req-rep',
      controllerPath: 'src/routes/parameters/req-rep.ts:9:15',
      parameters: [{ value: 'reply' }],
      schema: {
        operationId: 'ParametersReqRepController.post',
        response: {
          default: { $ref: 'ParametersReqRepController.postResponse' }
        }
      },
      rendered:
        'fastify.route({\n  method: \'POST\',\n  url: \'/parameters/req-rep\',\n  schema: {"operationId":"ParametersReqRepController.post","response":{"default":{"$ref":"ParametersReqRepController.postResponse"}}},\n  //@ts-ignore - unused\n  handler: async (request, reply) => {\n\n    const data = await ParametersReqRepController.post.apply(context, [reply]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ParametersReqRepController.post() returns nothing, typescript gets mad.\n      if (data) {\n        const error = new Error(\'Reply already sent, but controller returned data\');\n    \n        //@ts-expect-error - include data in error to help debugging\n        error.data = data;\n        \n        return error;\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    },
    {
      controllerMethod: 'put',
      method: 'PUT',
      controllerName: 'ParametersReqRepController',
      url: '/parameters/req-rep',
      controllerPath: 'src/routes/parameters/req-rep.ts:13:15',
      parameters: [{ value: 'reply' }],
      schema: {
        operationId: 'ParametersReqRepController.put',
        response: {
          default: { $ref: 'ParametersReqRepController.putResponse' }
        }
      },
      rendered:
        'fastify.route({\n  method: \'PUT\',\n  url: \'/parameters/req-rep\',\n  schema: {"operationId":"ParametersReqRepController.put","response":{"default":{"$ref":"ParametersReqRepController.putResponse"}}},\n  //@ts-ignore - unused\n  handler: async (request, reply) => {\n\n    const data = await ParametersReqRepController.put.apply(context, [reply]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ParametersReqRepController.put() returns nothing, typescript gets mad.\n      if (data) {\n        const error = new Error(\'Reply already sent, but controller returned data\');\n    \n        //@ts-expect-error - include data in error to help debugging\n        error.data = data;\n        \n        return error;\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    },
    {
      controllerMethod: 'Delete',
      method: 'DELETE',
      controllerName: 'ParametersReqRepController',
      url: '/parameters/req-rep',
      controllerPath: 'src/routes/parameters/req-rep.ts:17:15',
      parameters: [{ value: 'reply' }],
      schema: {
        operationId: 'ParametersReqRepController.Delete',
        response: {
          default: { $ref: 'ParametersReqRepController.DeleteResponse' }
        }
      },
      rendered:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'/parameters/req-rep\',\n  schema: {"operationId":"ParametersReqRepController.Delete","response":{"default":{"$ref":"ParametersReqRepController.DeleteResponse"}}},\n  //@ts-ignore - unused\n  handler: async (request, reply) => {\n\n    const data = await ParametersReqRepController.Delete.apply(context, [reply]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ParametersReqRepController.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        const error = new Error(\'Reply already sent, but controller returned data\');\n    \n        //@ts-expect-error - include data in error to help debugging\n        error.data = data;\n        \n        return error;\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    }
  ],
  schemas: [
    { $id: 'ParametersReqRepController.postResponse', type: 'null' },
    { $id: 'ParametersReqRepController.putResponse', type: 'null' },
    { $id: 'ParametersReqRepController.DeleteResponse', type: 'string' },
    { $id: 'ParametersReqRepController.getResponse', type: 'string' }
  ],
  imports: ["import * as ParametersReqRepController from './routes/parameters/req-rep';"]
};
