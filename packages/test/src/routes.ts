import type { RouteContext, ProvidedRouteContext } from '@kitajs/runtime';
import fp from 'fastify-plugin';
import '@fastify/swagger';
import AuthParam from './helpers/auth-param';
import * as ResponseTypes2Controller from './routes/response-types-2';
import * as WsController from './routes/ws';
import * as ResponseTypesCopy10Controller from './routes/response-types copy 10';
import * as ResponseTypesCopy11Controller from './routes/response-types copy 11';
import * as ResponseTypesCopy12Controller from './routes/response-types copy 12';
import * as ResponseTypesCopy13Controller from './routes/response-types copy 13';
import * as ResponseTypesCopy14Controller from './routes/response-types copy 14';
import * as ResponseTypesCopy15Controller from './routes/response-types copy 15';
import * as ResponseTypesCopy16Controller from './routes/response-types copy 16';
import * as ResponseTypesCopy17Controller from './routes/response-types copy 17';
import * as ResponseTypesCopy18Controller from './routes/response-types copy 18';
import * as ResponseTypesCopy19Controller from './routes/response-types copy 19';
import * as ResponseTypesCopy2Controller from './routes/response-types copy 2';
import * as ResponseTypesCopy20Controller from './routes/response-types copy 20';
import * as ResponseTypesCopy21Controller from './routes/response-types copy 21';
import * as ResponseTypesCopy22Controller from './routes/response-types copy 22';
import * as ResponseTypesCopy3Controller from './routes/response-types copy 3';
import * as ResponseTypesCopy4Controller from './routes/response-types copy 4';
import * as ResponseTypesCopy5Controller from './routes/response-types copy 5';
import * as ResponseTypesCopy6Controller from './routes/response-types copy 6';
import * as ResponseTypesCopy7Controller from './routes/response-types copy 7';
import * as ResponseTypesCopy8Controller from './routes/response-types copy 8';
import * as ResponseTypesCopy9Controller from './routes/response-types copy 9';
import * as ResponseTypesCopyController from './routes/response-types copy';
import * as ResponseTypesController from './routes/response-types';

/** The resultant config read from your kita config file. */
export const KitaConfig = {
  params: { AuthParam: './src/helpers/auth-param' },
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
    $id: 'HelloWorldQuery',
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      age: {
        type: 'number'
      }
    },
    required: ['name', 'age'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'withCustomParameterResponseResponse',
    type: 'object',
    properties: {
      f: {
        $ref: '#/definitions/Result'
      }
    },
    required: ['f'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'Result',
    type: 'string',
    enum: ['ok', 'error']
  });

  fastify.addSchema({
    $id: 'nameResponse',
    type: 'null'
  });

  fastify.addSchema({
    $id: 'withTypedPromiseResponseResponse',
    type: 'object',
    properties: {
      a: {
        type: 'string'
      }
    },
    required: ['a'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'withInferredResponseResponse',
    type: 'object',
    properties: {
      b: {
        type: 'string'
      }
    },
    required: ['b'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'PR',
    type: 'object',
    properties: {
      c: {
        type: 'string'
      }
    },
    required: ['c'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'DR',
    type: 'object',
    properties: {
      d: {
        type: 'string'
      }
    },
    required: ['d'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'HWData',
    type: 'object',
    properties: {
      e: {
        type: 'string'
      }
    },
    required: ['e'],
    additionalProperties: false
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy10Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy10Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy10Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy10Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy10Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy10Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy10Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy10Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy10Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy10Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy10Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy10Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy10Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy11Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy11Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy11Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy11Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy11Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy11Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy11Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy11Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy11Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy11Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy11Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy11Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy11Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy12Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy12Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy12Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy12Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy12Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy12Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy12Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy12Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy12Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy12Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy12Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy12Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy12Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy13Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy13Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy13Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy13Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy13Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy13Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy13Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy13Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy13Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy13Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy13Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy13Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy13Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy14Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy14Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy14Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy14Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy14Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy14Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy14Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy14Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy14Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy14Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy14Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy14Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy14Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy15Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy15Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy15Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy15Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy15Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy15Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy15Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy15Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy15Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy15Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy15Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy15Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy15Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy16Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy16Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy16Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy16Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy16Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy16Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy16Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy16Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy16Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy16Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy16Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy16Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy16Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy17Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy17Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy17Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy17Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy17Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy17Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy17Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy17Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy17Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy17Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy17Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy17Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy17Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy18Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy18Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy18Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy18Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy18Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy18Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy18Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy18Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy18Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy18Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy18Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy18Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy18Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy19Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy19Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy19Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy19Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy19Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy19Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy19Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy19Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy19Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy19Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy19Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy19Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy19Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy2Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy2Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy2Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy2Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy2Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy2Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy2Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy2Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy2Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy2Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy2Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy2Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy2Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy20Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy20Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy20Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy20Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy20Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy20Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy20Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy20Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy20Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy20Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy20Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy20Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy20Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy21Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy21Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy21Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy21Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy21Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy21Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy21Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy21Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy21Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy21Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy21Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy21Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy21Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy22Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy22Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy22Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy22Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy22Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy22Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy22Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy22Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy22Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy22Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy22Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy22Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy22Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy3Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy3Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy3Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy3Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy3Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy3Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy3Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy3Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy3Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy3Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy3Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy3Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy3Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy4Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy4Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy4Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy4Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy4Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy4Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy4Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy4Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy4Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy4Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy4Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy4Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy4Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy5Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy5Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy5Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy5Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy5Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy5Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy5Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy5Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy5Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy5Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy5Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy5Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy5Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy6Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy6Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy6Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy6Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy6Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy6Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy6Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy6Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy6Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy6Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy6Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy6Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy6Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy7Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy7Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy7Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy7Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy7Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy7Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy7Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy7Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy7Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy7Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy7Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy7Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy7Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy8Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy8Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy8Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy8Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy8Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy8Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy8Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy8Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy8Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy8Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy8Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy8Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy8Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy9Controller.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy9Controller.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy9Controller.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy9Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy9Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy9Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopy9Controller.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy9Controller.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy9Controller.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy9Controller.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopy9Controller.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopy9Controller.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopy9Controller.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopyController.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopyController.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopyController.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopyController.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopyController.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopyController.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesCopyController.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopyController.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopyController.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopyController.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesCopyController.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesCopyController.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesCopyController.Delete() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withImportedResponseType',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'HWData' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypes2Controller.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypes2Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypes2Controller.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withCustomParameterResponse',
      response: { default: { $ref: 'withCustomParameterResponseResponse' } }
    },
    handler: async (request, reply) => {
      const auth = await AuthParam.call(context, request, reply, ['jwt']);

      if (reply.sent) {
        return;
      }

      const data = await ResponseTypes2Controller.Get.apply(context, [auth]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypes2Controller.Get() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesController.Get.apply(context, [
        request.query as Parameters<typeof ResponseTypesController.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesController.Get() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'withInferredResponseResponse' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesController.Post.apply(context, [
        request.query as Parameters<typeof ResponseTypesController.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesController.Post() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    },
    preHandler: ResponseTypesController.preHandler
  });

  fastify.route({
    method: 'PUT',
    url: '',
    schema: {
      operationId: 'withPromiseTypeAlias',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesController.Put.apply(context, [
        request.query as Parameters<typeof ResponseTypesController.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesController.Put() returns nothing, typescript gets mad.
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
    url: '',
    schema: {
      operationId: 'withTypeAliasPromise',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await ResponseTypesController.Delete.apply(context, [
        request.query as Parameters<typeof ResponseTypesController.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - When ResponseTypesController.Delete() returns nothing, typescript gets mad.
        if (data) {
          throw Helpers.replyAlreadySent(data);
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '',
    schema: { operationId: 'name', response: { default: { $ref: 'nameResponse' } } },
    websocket: true,
    handler: async (request, reply) => {
      return WsController.ws.apply(context, [
        connection as Parameters<typeof WsController.ws>[0],
        (connection as Parameters<typeof WsController.ws>[1]).socket,
        request as Parameters<typeof WsController.ws>[2]
      ]);
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
    params: { AuthParam: './src/helpers/auth-param' },
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
      controllerName: 'ResponseTypesCopy10Controller',
      route: '/response-types-copy-10',
      controllerPath: 'src/routes/response-types copy 10.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy10Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy10Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy10Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy10Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy10Controller',
      route: '/response-types-copy-10',
      controllerPath: 'src/routes/response-types copy 10.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy10Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy10Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy10Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy10Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy10Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy10Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy10Controller',
      route: '/response-types-copy-10',
      controllerPath: 'src/routes/response-types copy 10.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy10Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy10Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy10Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy10Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy10Controller',
      route: '/response-types-copy-10',
      controllerPath: 'src/routes/response-types copy 10.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy10Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy10Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy10Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy10Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy11Controller',
      route: '/response-types-copy-11',
      controllerPath: 'src/routes/response-types copy 11.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy11Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy11Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy11Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy11Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy11Controller',
      route: '/response-types-copy-11',
      controllerPath: 'src/routes/response-types copy 11.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy11Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy11Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy11Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy11Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy11Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy11Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy11Controller',
      route: '/response-types-copy-11',
      controllerPath: 'src/routes/response-types copy 11.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy11Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy11Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy11Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy11Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy11Controller',
      route: '/response-types-copy-11',
      controllerPath: 'src/routes/response-types copy 11.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy11Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy11Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy11Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy11Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy12Controller',
      route: '/response-types-copy-12',
      controllerPath: 'src/routes/response-types copy 12.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy12Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy12Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy12Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy12Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy12Controller',
      route: '/response-types-copy-12',
      controllerPath: 'src/routes/response-types copy 12.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy12Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy12Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy12Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy12Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy12Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy12Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy12Controller',
      route: '/response-types-copy-12',
      controllerPath: 'src/routes/response-types copy 12.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy12Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy12Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy12Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy12Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy12Controller',
      route: '/response-types-copy-12',
      controllerPath: 'src/routes/response-types copy 12.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy12Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy12Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy12Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy12Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy13Controller',
      route: '/response-types-copy-13',
      controllerPath: 'src/routes/response-types copy 13.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy13Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy13Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy13Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy13Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy13Controller',
      route: '/response-types-copy-13',
      controllerPath: 'src/routes/response-types copy 13.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy13Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy13Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy13Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy13Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy13Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy13Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy13Controller',
      route: '/response-types-copy-13',
      controllerPath: 'src/routes/response-types copy 13.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy13Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy13Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy13Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy13Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy13Controller',
      route: '/response-types-copy-13',
      controllerPath: 'src/routes/response-types copy 13.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy13Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy13Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy13Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy13Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy14Controller',
      route: '/response-types-copy-14',
      controllerPath: 'src/routes/response-types copy 14.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy14Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy14Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy14Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy14Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy14Controller',
      route: '/response-types-copy-14',
      controllerPath: 'src/routes/response-types copy 14.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy14Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy14Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy14Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy14Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy14Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy14Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy14Controller',
      route: '/response-types-copy-14',
      controllerPath: 'src/routes/response-types copy 14.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy14Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy14Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy14Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy14Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy14Controller',
      route: '/response-types-copy-14',
      controllerPath: 'src/routes/response-types copy 14.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy14Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy14Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy14Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy14Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy15Controller',
      route: '/response-types-copy-15',
      controllerPath: 'src/routes/response-types copy 15.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy15Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy15Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy15Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy15Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy15Controller',
      route: '/response-types-copy-15',
      controllerPath: 'src/routes/response-types copy 15.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy15Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy15Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy15Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy15Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy15Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy15Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy15Controller',
      route: '/response-types-copy-15',
      controllerPath: 'src/routes/response-types copy 15.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy15Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy15Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy15Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy15Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy15Controller',
      route: '/response-types-copy-15',
      controllerPath: 'src/routes/response-types copy 15.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy15Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy15Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy15Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy15Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy16Controller',
      route: '/response-types-copy-16',
      controllerPath: 'src/routes/response-types copy 16.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy16Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy16Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy16Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy16Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy16Controller',
      route: '/response-types-copy-16',
      controllerPath: 'src/routes/response-types copy 16.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy16Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy16Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy16Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy16Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy16Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy16Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy16Controller',
      route: '/response-types-copy-16',
      controllerPath: 'src/routes/response-types copy 16.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy16Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy16Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy16Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy16Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy16Controller',
      route: '/response-types-copy-16',
      controllerPath: 'src/routes/response-types copy 16.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy16Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy16Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy16Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy16Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy17Controller',
      route: '/response-types-copy-17',
      controllerPath: 'src/routes/response-types copy 17.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy17Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy17Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy17Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy17Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy17Controller',
      route: '/response-types-copy-17',
      controllerPath: 'src/routes/response-types copy 17.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy17Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy17Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy17Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy17Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy17Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy17Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy17Controller',
      route: '/response-types-copy-17',
      controllerPath: 'src/routes/response-types copy 17.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy17Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy17Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy17Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy17Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy17Controller',
      route: '/response-types-copy-17',
      controllerPath: 'src/routes/response-types copy 17.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy17Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy17Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy17Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy17Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy18Controller',
      route: '/response-types-copy-18',
      controllerPath: 'src/routes/response-types copy 18.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy18Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy18Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy18Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy18Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy18Controller',
      route: '/response-types-copy-18',
      controllerPath: 'src/routes/response-types copy 18.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy18Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy18Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy18Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy18Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy18Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy18Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy18Controller',
      route: '/response-types-copy-18',
      controllerPath: 'src/routes/response-types copy 18.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy18Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy18Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy18Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy18Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy18Controller',
      route: '/response-types-copy-18',
      controllerPath: 'src/routes/response-types copy 18.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy18Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy18Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy18Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy18Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy19Controller',
      route: '/response-types-copy-19',
      controllerPath: 'src/routes/response-types copy 19.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy19Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy19Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy19Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy19Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy19Controller',
      route: '/response-types-copy-19',
      controllerPath: 'src/routes/response-types copy 19.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy19Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy19Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy19Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy19Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy19Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy19Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy19Controller',
      route: '/response-types-copy-19',
      controllerPath: 'src/routes/response-types copy 19.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy19Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy19Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy19Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy19Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy19Controller',
      route: '/response-types-copy-19',
      controllerPath: 'src/routes/response-types copy 19.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy19Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy19Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy19Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy19Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy2Controller',
      route: '/response-types-copy-2',
      controllerPath: 'src/routes/response-types copy 2.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy2Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy2Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy2Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy2Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy2Controller',
      route: '/response-types-copy-2',
      controllerPath: 'src/routes/response-types copy 2.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy2Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy2Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy2Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy2Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy2Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy2Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy2Controller',
      route: '/response-types-copy-2',
      controllerPath: 'src/routes/response-types copy 2.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy2Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy2Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy2Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy2Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy2Controller',
      route: '/response-types-copy-2',
      controllerPath: 'src/routes/response-types copy 2.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy2Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy2Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy2Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy2Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy20Controller',
      route: '/response-types-copy-20',
      controllerPath: 'src/routes/response-types copy 20.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy20Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy20Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy20Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy20Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy20Controller',
      route: '/response-types-copy-20',
      controllerPath: 'src/routes/response-types copy 20.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy20Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy20Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy20Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy20Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy20Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy20Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy20Controller',
      route: '/response-types-copy-20',
      controllerPath: 'src/routes/response-types copy 20.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy20Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy20Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy20Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy20Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy20Controller',
      route: '/response-types-copy-20',
      controllerPath: 'src/routes/response-types copy 20.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy20Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy20Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy20Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy20Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy21Controller',
      route: '/response-types-copy-21',
      controllerPath: 'src/routes/response-types copy 21.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy21Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy21Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy21Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy21Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy21Controller',
      route: '/response-types-copy-21',
      controllerPath: 'src/routes/response-types copy 21.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy21Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy21Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy21Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy21Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy21Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy21Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy21Controller',
      route: '/response-types-copy-21',
      controllerPath: 'src/routes/response-types copy 21.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy21Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy21Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy21Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy21Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy21Controller',
      route: '/response-types-copy-21',
      controllerPath: 'src/routes/response-types copy 21.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy21Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy21Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy21Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy21Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy22Controller',
      route: '/response-types-copy-22',
      controllerPath: 'src/routes/response-types copy 22.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy22Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy22Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy22Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy22Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy22Controller',
      route: '/response-types-copy-22',
      controllerPath: 'src/routes/response-types copy 22.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy22Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy22Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy22Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy22Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy22Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy22Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy22Controller',
      route: '/response-types-copy-22',
      controllerPath: 'src/routes/response-types copy 22.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy22Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy22Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy22Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy22Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy22Controller',
      route: '/response-types-copy-22',
      controllerPath: 'src/routes/response-types copy 22.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy22Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy22Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy22Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy22Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy3Controller',
      route: '/response-types-copy-3',
      controllerPath: 'src/routes/response-types copy 3.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy3Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy3Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy3Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy3Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy3Controller',
      route: '/response-types-copy-3',
      controllerPath: 'src/routes/response-types copy 3.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy3Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy3Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy3Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy3Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy3Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy3Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy3Controller',
      route: '/response-types-copy-3',
      controllerPath: 'src/routes/response-types copy 3.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy3Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy3Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy3Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy3Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy3Controller',
      route: '/response-types-copy-3',
      controllerPath: 'src/routes/response-types copy 3.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy3Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy3Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy3Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy3Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy4Controller',
      route: '/response-types-copy-4',
      controllerPath: 'src/routes/response-types copy 4.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy4Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy4Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy4Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy4Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy4Controller',
      route: '/response-types-copy-4',
      controllerPath: 'src/routes/response-types copy 4.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy4Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy4Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy4Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy4Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy4Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy4Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy4Controller',
      route: '/response-types-copy-4',
      controllerPath: 'src/routes/response-types copy 4.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy4Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy4Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy4Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy4Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy4Controller',
      route: '/response-types-copy-4',
      controllerPath: 'src/routes/response-types copy 4.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy4Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy4Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy4Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy4Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy5Controller',
      route: '/response-types-copy-5',
      controllerPath: 'src/routes/response-types copy 5.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy5Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy5Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy5Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy5Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy5Controller',
      route: '/response-types-copy-5',
      controllerPath: 'src/routes/response-types copy 5.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy5Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy5Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy5Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy5Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy5Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy5Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy5Controller',
      route: '/response-types-copy-5',
      controllerPath: 'src/routes/response-types copy 5.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy5Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy5Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy5Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy5Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy5Controller',
      route: '/response-types-copy-5',
      controllerPath: 'src/routes/response-types copy 5.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy5Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy5Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy5Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy5Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy6Controller',
      route: '/response-types-copy-6',
      controllerPath: 'src/routes/response-types copy 6.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy6Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy6Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy6Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy6Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy6Controller',
      route: '/response-types-copy-6',
      controllerPath: 'src/routes/response-types copy 6.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy6Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy6Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy6Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy6Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy6Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy6Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy6Controller',
      route: '/response-types-copy-6',
      controllerPath: 'src/routes/response-types copy 6.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy6Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy6Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy6Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy6Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy6Controller',
      route: '/response-types-copy-6',
      controllerPath: 'src/routes/response-types copy 6.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy6Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy6Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy6Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy6Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy7Controller',
      route: '/response-types-copy-7',
      controllerPath: 'src/routes/response-types copy 7.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy7Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy7Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy7Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy7Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy7Controller',
      route: '/response-types-copy-7',
      controllerPath: 'src/routes/response-types copy 7.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy7Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy7Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy7Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy7Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy7Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy7Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy7Controller',
      route: '/response-types-copy-7',
      controllerPath: 'src/routes/response-types copy 7.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy7Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy7Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy7Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy7Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy7Controller',
      route: '/response-types-copy-7',
      controllerPath: 'src/routes/response-types copy 7.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy7Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy7Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy7Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy7Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy8Controller',
      route: '/response-types-copy-8',
      controllerPath: 'src/routes/response-types copy 8.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy8Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy8Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy8Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy8Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy8Controller',
      route: '/response-types-copy-8',
      controllerPath: 'src/routes/response-types copy 8.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy8Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy8Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy8Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy8Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy8Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy8Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy8Controller',
      route: '/response-types-copy-8',
      controllerPath: 'src/routes/response-types copy 8.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy8Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy8Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy8Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy8Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy8Controller',
      route: '/response-types-copy-8',
      controllerPath: 'src/routes/response-types copy 8.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy8Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy8Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy8Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy8Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy9Controller',
      route: '/response-types-copy-9',
      controllerPath: 'src/routes/response-types copy 9.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy9Controller.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy9Controller.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy9Controller.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy9Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy9Controller',
      route: '/response-types-copy-9',
      controllerPath: 'src/routes/response-types copy 9.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy9Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopy9Controller.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy9Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy9Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy9Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopy9Controller.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy9Controller',
      route: '/response-types-copy-9',
      controllerPath: 'src/routes/response-types copy 9.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy9Controller.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy9Controller.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy9Controller.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy9Controller.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopy9Controller',
      route: '/response-types-copy-9',
      controllerPath: 'src/routes/response-types copy 9.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopy9Controller.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopy9Controller.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopy9Controller.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopy9Controller.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopyController',
      route: '/response-types-copy',
      controllerPath: 'src/routes/response-types copy.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopyController.Get>[0])'
        }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopyController.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesCopyController.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopyController.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopyController',
      route: '/response-types-copy',
      controllerPath: 'src/routes/response-types copy.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopyController.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesCopyController.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopyController.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesCopyController.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopyController.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesCopyController.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopyController',
      route: '/response-types-copy',
      controllerPath: 'src/routes/response-types copy.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopyController.Put>[0])'
        }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopyController.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesCopyController.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopyController.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesCopyController',
      route: '/response-types-copy',
      controllerPath: 'src/routes/response-types copy.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value:
            '(request.query as Parameters<typeof ResponseTypesCopyController.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesCopyController.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesCopyController.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesCopyController.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypes2Controller',
      route: '/response-types-2',
      controllerPath: 'src/routes/response-types-2.ts:6:21',
      controllerMethod: 'Post',
      parameters: [
        {
          value: '(request.query as Parameters<typeof ResponseTypes2Controller.Post>[0])'
        }
      ],
      schema: {
        operationId: 'withImportedResponseType',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'HWData' } }
      },
      method: 'POST',
      operationId: 'withImportedResponseType',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withImportedResponseType","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"HWData"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypes2Controller.Post.apply(context, [(request.query as Parameters<typeof ResponseTypes2Controller.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypes2Controller.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypes2Controller',
      route: '/response-types-2',
      controllerPath: 'src/routes/response-types-2.ts:17:21',
      controllerMethod: 'Get',
      parameters: [
        {
          value: 'auth',
          helper: "const auth = await AuthParam.call(context, request, reply, ['jwt']);"
        }
      ],
      schema: {
        operationId: 'withCustomParameterResponse',
        response: { default: { $ref: 'withCustomParameterResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withCustomParameterResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withCustomParameterResponse","response":{"default":{"$ref":"withCustomParameterResponseResponse"}}},\n  handler: async (request, reply) => {\n        const auth = await AuthParam.call(context, request, reply, [\'jwt\']);\n\n        if (reply.sent) {\n          return;\n        }\n\n    const data = await ResponseTypes2Controller.Get.apply(context, [auth]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypes2Controller.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesController',
      route: '/response-types',
      controllerPath: 'src/routes/response-types.ts:5:21',
      controllerMethod: 'Get',
      parameters: [
        { value: '(request.query as Parameters<typeof ResponseTypesController.Get>[0])' }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withTypedPromiseResponseResponse' } }
      },
      method: 'GET',
      operationId: 'withTypedPromiseResponse',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"withTypedPromiseResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withTypedPromiseResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesController.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesController.Get>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesController.Get() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesController',
      route: '/response-types',
      controllerPath: 'src/routes/response-types.ts:14:21',
      controllerMethod: 'Post',
      parameters: [
        { value: '(request.query as Parameters<typeof ResponseTypesController.Post>[0])' }
      ],
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'withInferredResponseResponse' } }
      },
      method: 'POST',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesController.preHandler',
      template:
        'fastify.route({\n  method: \'POST\',\n  url: \'\',\n  schema: {"operationId":"withInferredResponse","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"withInferredResponseResponse"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesController.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesController.Post>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesController.Post() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  preHandler: ResponseTypesController.preHandler\n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesController',
      route: '/response-types',
      controllerPath: 'src/routes/response-types.ts:25:21',
      controllerMethod: 'Put',
      parameters: [
        { value: '(request.query as Parameters<typeof ResponseTypesController.Put>[0])' }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      method: 'PUT',
      operationId: 'withPromiseTypeAlias',
      template:
        'fastify.route({\n  method: \'PUT\',\n  url: \'\',\n  schema: {"operationId":"withPromiseTypeAlias","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"PR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesController.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesController.Put>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesController.Put() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/rest.hbs',
      controllerName: 'ResponseTypesController',
      route: '/response-types',
      controllerPath: 'src/routes/response-types.ts:36:21',
      controllerMethod: 'Delete',
      parameters: [
        {
          value: '(request.query as Parameters<typeof ResponseTypesController.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      method: 'DELETE',
      operationId: 'withTypeAliasPromise',
      template:
        'fastify.route({\n  method: \'DELETE\',\n  url: \'\',\n  schema: {"operationId":"withTypeAliasPromise","querystring":{"$ref":"HelloWorldQuery"},"response":{"default":{"$ref":"DR"}}},\n  handler: async (request, reply) => {\n\n    const data = await ResponseTypesController.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesController.Delete>[0])]);\n    \n    if (reply.sent) {\n      //@ts-ignore - When ResponseTypesController.Delete() returns nothing, typescript gets mad.\n      if (data) {\n        throw Helpers.replyAlreadySent(data);\n      }\n\n      return;\n    }\n\n    return data;\n  },\n  \n});\n '
    },
    {
      templatePath: 'routes/websocket.hbs',
      controllerName: 'WsController',
      route: '/ws',
      controllerPath: 'src/routes/ws.ts:3:15',
      parameters: [
        { value: 'connection as Parameters<typeof WsController.ws>[0]' },
        { value: '(connection as Parameters<typeof WsController.ws>[1]).socket' },
        { value: 'request as Parameters<typeof WsController.ws>[2]' }
      ],
      schema: { operationId: 'name', response: { default: { $ref: 'nameResponse' } } },
      websocket: true,
      controllerMethod: 'ws',
      method: 'GET',
      operationId: 'name',
      template:
        'fastify.route({\n  method: \'GET\',\n  url: \'\',\n  schema: {"operationId":"name","response":{"default":{"$ref":"nameResponse"}}},\n  websocket: true,\n  handler: async (request, reply) => {\n\n    return WsController.ws.apply(context, [connection as Parameters<typeof WsController.ws>[0],(connection as Parameters<typeof WsController.ws>[1]).socket,request as Parameters<typeof WsController.ws>[2]]);\n  },\n  \n});\n '
    }
  ],
  schemas: [
    {
      $id: 'HelloWorldQuery',
      type: 'object',
      properties: { name: { type: 'string' }, age: { type: 'number' } },
      required: ['name', 'age'],
      additionalProperties: false
    },
    {
      $id: 'withCustomParameterResponseResponse',
      type: 'object',
      properties: { f: { $ref: '#/definitions/Result' } },
      required: ['f'],
      additionalProperties: false
    },
    { $id: 'Result', type: 'string', enum: ['ok', 'error'] },
    { $id: 'nameResponse', type: 'null' },
    {
      $id: 'withTypedPromiseResponseResponse',
      type: 'object',
      properties: { a: { type: 'string' } },
      required: ['a'],
      additionalProperties: false
    },
    {
      $id: 'withInferredResponseResponse',
      type: 'object',
      properties: { b: { type: 'string' } },
      required: ['b'],
      additionalProperties: false
    },
    {
      $id: 'PR',
      type: 'object',
      properties: { c: { type: 'string' } },
      required: ['c'],
      additionalProperties: false
    },
    {
      $id: 'DR',
      type: 'object',
      properties: { d: { type: 'string' } },
      required: ['d'],
      additionalProperties: false
    },
    {
      $id: 'HWData',
      type: 'object',
      properties: { e: { type: 'string' } },
      required: ['e'],
      additionalProperties: false
    }
  ],
  imports: [
    "import AuthParam from './helpers/auth-param';",
    "import * as ResponseTypes2Controller from './routes/response-types-2';",
    "import * as WsController from './routes/ws';",
    "import * as ResponseTypesCopy10Controller from './routes/response-types copy 10';",
    "import * as ResponseTypesCopy11Controller from './routes/response-types copy 11';",
    "import * as ResponseTypesCopy12Controller from './routes/response-types copy 12';",
    "import * as ResponseTypesCopy13Controller from './routes/response-types copy 13';",
    "import * as ResponseTypesCopy14Controller from './routes/response-types copy 14';",
    "import * as ResponseTypesCopy15Controller from './routes/response-types copy 15';",
    "import * as ResponseTypesCopy16Controller from './routes/response-types copy 16';",
    "import * as ResponseTypesCopy17Controller from './routes/response-types copy 17';",
    "import * as ResponseTypesCopy18Controller from './routes/response-types copy 18';",
    "import * as ResponseTypesCopy19Controller from './routes/response-types copy 19';",
    "import * as ResponseTypesCopy2Controller from './routes/response-types copy 2';",
    "import * as ResponseTypesCopy20Controller from './routes/response-types copy 20';",
    "import * as ResponseTypesCopy21Controller from './routes/response-types copy 21';",
    "import * as ResponseTypesCopy22Controller from './routes/response-types copy 22';",
    "import * as ResponseTypesCopy3Controller from './routes/response-types copy 3';",
    "import * as ResponseTypesCopy4Controller from './routes/response-types copy 4';",
    "import * as ResponseTypesCopy5Controller from './routes/response-types copy 5';",
    "import * as ResponseTypesCopy6Controller from './routes/response-types copy 6';",
    "import * as ResponseTypesCopy7Controller from './routes/response-types copy 7';",
    "import * as ResponseTypesCopy8Controller from './routes/response-types copy 8';",
    "import * as ResponseTypesCopy9Controller from './routes/response-types copy 9';",
    "import * as ResponseTypesCopyController from './routes/response-types copy';",
    "import * as ResponseTypesController from './routes/response-types';"
  ]
};
