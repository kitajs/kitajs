import type { RouteContext, ProvidedRouteContext } from '@kitajs/runtime';
import fp from 'fastify-plugin';
import '@fastify/swagger';
import * as ParametersReqRepController from './routes/parameters/req-rep';

/** The resultant config read from your kita config file. */
export const KitaConfig = {
  params: {},
  tsconfig: './tsconfig.json',
  templates: '@kitajs/generator/templates',
  controllers: {
    glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
    prefix: '(?:.*src)?/?(?:routes/?)'
  },
  routes: { output: './src/routes.ts' }
};

/** The fastify plugin to be registered. */
export const Kita = fp<{ context: ProvidedRouteContext }>((fastify, options) => {
  const context: RouteContext = { config: KitaConfig, fastify, ...options.context };

  fastify.addSchema({
    $id: 'ParametersReqRepControllerPOSTResponse',
    type: 'null'
  });

  fastify.addSchema({
    $id: 'ParametersReqRepControllerPUTResponse',
    type: 'null'
  });

  fastify.addSchema({
    $id: 'ParametersReqRepControllerDELETEResponse',
    type: 'string'
  });

  fastify.addSchema({
    $id: 'ParametersReqRepControllerGETResponse',
    type: 'string'
  });

  fastify.route({
    method: 'GET',
    url: '/parameters/req-rep',
    schema: { response: { default: { $ref: 'ParametersReqRepControllerGETResponse' } } },
    //@ts-ignore - unused
    handler: async (request, reply) => {
      const data = await ParametersReqRepController.get.apply(context, [request, reply]);

      if (reply.sent) {
        //@ts-ignore - When ParametersReqRepController.get() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'POST',
    url: '/parameters/req-rep',
    schema: { response: { default: { $ref: 'ParametersReqRepControllerPOSTResponse' } } },
    //@ts-ignore - unused
    handler: async (request, reply) => {
      const data = await ParametersReqRepController.post.apply(context, [reply]);

      if (reply.sent) {
        //@ts-ignore - When ParametersReqRepController.post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'PUT',
    url: '/parameters/req-rep',
    schema: { response: { default: { $ref: 'ParametersReqRepControllerPUTResponse' } } },
    //@ts-ignore - unused
    handler: async (request, reply) => {
      const data = await ParametersReqRepController.put.apply(context, [reply]);

      if (reply.sent) {
        //@ts-ignore - When ParametersReqRepController.put() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
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
      response: { default: { $ref: 'ParametersReqRepControllerDELETEResponse' } }
    },
    //@ts-ignore - unused
    handler: async (request, reply) => {
      const data = await ParametersReqRepController.Delete.apply(context, [reply]);

      if (reply.sent) {
        //@ts-ignore - When ParametersReqRepController.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  // Ensure this function remains a "async" function
  return Promise.resolve();
});

/** Internal helpers to this template */
export const Helpers = {
  replyAlreadySent(data: any) {
    const error = new Error('Reply already sent, but controller returned data');

    //@ts-expect-error - include data in error to help debugging
    error.data = data;

    return error;
  }
};

/** Handlebars data for hydration, just for debugging purposes. */
export const HBS_CONF = {
  config: {
    params: {},
    tsconfig: './tsconfig.json',
    templates: '@kitajs/generator/templates',
    controllers: {
      glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
      prefix: '(?:.*src)?/?(?:routes/?)'
    },
    routes: { output: './src/routes.ts' }
  },
  routes: [
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ParametersReqRepController',
      url: '/parameters/req-rep',
      controllerPath: 'src/routes/parameters/req-rep.ts:3:15',
      controllerMethod: 'get',
      parameters: [{ value: 'request' }, { value: 'reply' }],
      schema: {
        response: { default: { $ref: 'ParametersReqRepControllerGETResponse' } }
      },
      method: 'GET',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'/parameters/req-rep\',\n  schema: {"response":{"default":{"$ref":"ParametersReqRepControllerGETResponse"}}},\n  //@ts-ignore - unused\n  handler: async (request, reply) => {\n\n    const data = await ParametersReqRepController.get.apply(context, [request,reply]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ParametersReqRepController.get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ParametersReqRepController',
      url: '/parameters/req-rep',
      controllerPath: 'src/routes/parameters/req-rep.ts:9:15',
      controllerMethod: 'post',
      parameters: [{ value: 'reply' }],
      schema: {
        response: { default: { $ref: 'ParametersReqRepControllerPOSTResponse' } }
      },
      method: 'POST',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'/parameters/req-rep\',\n  schema: {"response":{"default":{"$ref":"ParametersReqRepControllerPOSTResponse"}}},\n  //@ts-ignore - unused\n  handler: async (request, reply) => {\n\n    const data = await ParametersReqRepController.post.apply(context, [reply]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ParametersReqRepController.post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ParametersReqRepController',
      url: '/parameters/req-rep',
      controllerPath: 'src/routes/parameters/req-rep.ts:13:15',
      controllerMethod: 'put',
      parameters: [{ value: 'reply' }],
      schema: {
        response: { default: { $ref: 'ParametersReqRepControllerPUTResponse' } }
      },
      method: 'PUT',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'/parameters/req-rep\',\n  schema: {"response":{"default":{"$ref":"ParametersReqRepControllerPUTResponse"}}},\n  //@ts-ignore - unused\n  handler: async (request, reply) => {\n\n    const data = await ParametersReqRepController.put.apply(context, [reply]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ParametersReqRepController.put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ParametersReqRepController',
      url: '/parameters/req-rep',
      controllerPath: 'src/routes/parameters/req-rep.ts:17:15',
      controllerMethod: 'Delete',
      parameters: [{ value: 'reply' }],
      schema: {
        response: { default: { $ref: 'ParametersReqRepControllerDELETEResponse' } }
      },
      method: 'DELETE',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'/parameters/req-rep\',\n  schema: {"response":{"default":{"$ref":"ParametersReqRepControllerDELETEResponse"}}},\n  //@ts-ignore - unused\n  handler: async (request, reply) => {\n\n    const data = await ParametersReqRepController.Delete.apply(context, [reply]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ParametersReqRepController.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});'
    }
  ],
  schemas: [
    { $id: 'ParametersReqRepControllerPOSTResponse', type: 'null' },
    { $id: 'ParametersReqRepControllerPUTResponse', type: 'null' },
    { $id: 'ParametersReqRepControllerDELETEResponse', type: 'string' },
    { $id: 'ParametersReqRepControllerGETResponse', type: 'string' }
  ],
  imports: ["import * as ParametersReqRepController from './routes/parameters/req-rep';"]
};
