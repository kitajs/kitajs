// Required
import type { RouteContext, ProvidedRouteContext } from '@kitajs/runtime';
import fp from 'fastify-plugin';

// Addons
import '@fastify/swagger';

// Controllers
import * as Helloworld2Controller from './routes/hello-world2';
import * as HelloworldController from './routes/hello-world';

// Param Resolvers
import AuthParam from './helpers/auth-param';

/** The resultant config read from your kita config file. */
export const KitaConfig = {
  tsconfig: './tsconfig.json',
  params: { AuthParam: './src/helpers/auth-param' },
  controllers: {
    glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
    prefix: '(?:src)?/?(routes/?)'
  },
  routes: {
    output: './src/routes.ts',
    template: '@kitajs/generator/templates/default.hbs'
  }
};

/** The fastify plugin to be registered. */
export const Kita = fp<{ context: ProvidedRouteContext }>((fastify, options) => {
  const context: RouteContext = { ...options.context, config: KitaConfig, fastify };

  fastify.addSchema({
    $id: 'HelloWorldQuery',
    type: 'object',
    properties: { name: { type: 'string' }, age: { type: 'number' } },
    required: ['name', 'age'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'Helloworld2Controller_Get_Response',
    type: 'object',
    properties: { f: { $ref: 'Result' } },
    required: ['f'],
    additionalProperties: false
  });

  fastify.addSchema({ $id: 'Result', type: 'string', enum: ['ok', 'error'] });

  fastify.addSchema({
    $id: 'HelloworldController_Get_Response',
    type: 'object',
    properties: { a: { type: 'string' } },
    required: ['a'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'HelloworldController_Post_Response',
    type: 'object',
    properties: { b: { type: 'string' } },
    required: ['b'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'PR',
    type: 'object',
    properties: { c: { type: 'string' } },
    required: ['c'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'DR',
    type: 'object',
    properties: { d: { type: 'string' } },
    required: ['d'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'HWData',
    type: 'object',
    properties: { e: { type: 'string' } },
    required: ['e'],
    additionalProperties: false
  });

  fastify.route({
    method: 'GET',
    url: '/hello-world2',
    schema: {
      operationId: 'helloWorld6',
      response: { default: { $ref: 'Helloworld2Controller_Get_Response' } }
    },
    handler: async (request, reply) => {
      const param1 = await AuthParam.call(context, request, reply, ['jwt']);

      if (reply.sent) {
        return;
      }

      const data = await Helloworld2Controller.Get.apply(context, [param1]);

      if (reply.sent) {
        //@ts-ignore - Possible "An expression of type 'void' cannot be tested for truthiness. ts(1345)"
        if (data) {
          const error = new Error('Reply already sent, but controller returned data');
          //@ts-expect-error - TODO: generate better error message
          error.data = data;
          throw error;
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'GET',
    url: '/hello-world',
    schema: {
      operationId: 'helloWorld1',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'HelloworldController_Get_Response' } }
    },
    handler: async (request, reply) => {
      const data = await HelloworldController.Get.apply(context, [
        request.query as Parameters<typeof HelloworldController.Get>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - Possible "An expression of type 'void' cannot be tested for truthiness. ts(1345)"
        if (data) {
          const error = new Error('Reply already sent, but controller returned data');
          //@ts-expect-error - TODO: generate better error message
          error.data = data;
          throw error;
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'POST',
    url: '/hello-world',
    schema: {
      operationId: 'helloWorld2',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'HelloworldController_Post_Response' } }
    },
    handler: async (request, reply) => {
      const data = await HelloworldController.Post.apply(context, [
        request.query as Parameters<typeof HelloworldController.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - Possible "An expression of type 'void' cannot be tested for truthiness. ts(1345)"
        if (data) {
          const error = new Error('Reply already sent, but controller returned data');
          //@ts-expect-error - TODO: generate better error message
          error.data = data;
          throw error;
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'PUT',
    url: '/hello-world',
    schema: {
      operationId: 'helloWorld3',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'PR' } }
    },
    handler: async (request, reply) => {
      const data = await HelloworldController.Put.apply(context, [
        request.query as Parameters<typeof HelloworldController.Put>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - Possible "An expression of type 'void' cannot be tested for truthiness. ts(1345)"
        if (data) {
          const error = new Error('Reply already sent, but controller returned data');
          //@ts-expect-error - TODO: generate better error message
          error.data = data;
          throw error;
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'DELETE',
    url: '/hello-world',
    schema: {
      operationId: 'helloWorld4',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'DR' } }
    },
    handler: async (request, reply) => {
      const data = await HelloworldController.Delete.apply(context, [
        request.query as Parameters<typeof HelloworldController.Delete>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - Possible "An expression of type 'void' cannot be tested for truthiness. ts(1345)"
        if (data) {
          const error = new Error('Reply already sent, but controller returned data');
          //@ts-expect-error - TODO: generate better error message
          error.data = data;
          throw error;
        }

        return;
      }

      return data;
    }
  });

  fastify.route({
    method: 'POST',
    url: '/hello-world2',
    schema: {
      operationId: 'helloWorld5',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'HWData' } }
    },
    handler: async (request, reply) => {
      const data = await Helloworld2Controller.Post.apply(context, [
        request.query as Parameters<typeof Helloworld2Controller.Post>[0]
      ]);

      if (reply.sent) {
        //@ts-ignore - Possible "An expression of type 'void' cannot be tested for truthiness. ts(1345)"
        if (data) {
          const error = new Error('Reply already sent, but controller returned data');
          //@ts-expect-error - TODO: generate better error message
          error.data = data;
          throw error;
        }

        return;
      }

      return data;
    }
  });

  // Ensure this function remains a "async" function
  return Promise.resolve();
});

export const HBS_CONF = {
  config: {
    tsconfig: './tsconfig.json',
    params: { AuthParam: './src/helpers/auth-param' },
    controllers: {
      glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
      prefix: '(?:src)?/?(routes/?)'
    },
    routes: {
      output: './src/routes.ts',
      template: '@kitajs/generator/templates/default.hbs'
    }
  },
  imports: {
    controllers: [
      "import * as Helloworld2Controller from './routes/hello-world2';",
      "import * as HelloworldController from './routes/hello-world';"
    ],
    params: ["import AuthParam from './helpers/auth-param';"],
    addons: ["import '@fastify/swagger';"]
  },
  routes: [
    {
      method: 'Get',
      controllerName: 'Helloworld2Controller',
      path: '/hello-world2',
      schema: {
        operationId: 'helloWorld6',
        response: { default: { $ref: 'Helloworld2Controller_Get_Response' } }
      },
      parameters: [
        {
          helper:
            "const param1 = await AuthParam.call(context, request, reply, ['jwt']);",
          value: 'param1'
        }
      ],
      options: '',
      operationId: 'helloWorld6'
    },
    {
      method: 'Get',
      controllerName: 'HelloworldController',
      path: '/hello-world',
      schema: {
        operationId: 'helloWorld1',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'HelloworldController_Get_Response' } }
      },
      parameters: [
        { value: '(request.query as Parameters<typeof HelloworldController.Get>[0])' }
      ],
      options: '',
      operationId: 'helloWorld1'
    },
    {
      method: 'Post',
      controllerName: 'HelloworldController',
      path: '/hello-world',
      schema: {
        operationId: 'helloWorld2',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'HelloworldController_Post_Response' } }
      },
      parameters: [
        { value: '(request.query as Parameters<typeof HelloworldController.Post>[0])' }
      ],
      options: '',
      operationId: 'helloWorld2'
    },
    {
      method: 'Put',
      controllerName: 'HelloworldController',
      path: '/hello-world',
      schema: {
        operationId: 'helloWorld3',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      parameters: [
        { value: '(request.query as Parameters<typeof HelloworldController.Put>[0])' }
      ],
      options: '',
      operationId: 'helloWorld3'
    },
    {
      method: 'Delete',
      controllerName: 'HelloworldController',
      path: '/hello-world',
      schema: {
        operationId: 'helloWorld4',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      parameters: [
        { value: '(request.query as Parameters<typeof HelloworldController.Delete>[0])' }
      ],
      options: '',
      operationId: 'helloWorld4'
    },
    {
      method: 'Post',
      controllerName: 'Helloworld2Controller',
      path: '/hello-world2',
      schema: {
        operationId: 'helloWorld5',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'HWData' } }
      },
      parameters: [
        { value: '(request.query as Parameters<typeof Helloworld2Controller.Post>[0])' }
      ],
      options: '',
      operationId: 'helloWorld5'
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
      $id: 'Helloworld2Controller_Get_Response',
      type: 'object',
      properties: { f: { $ref: 'Result' } },
      required: ['f'],
      additionalProperties: false
    },
    { $id: 'Result', type: 'string', enum: ['ok', 'error'] },
    {
      $id: 'HelloworldController_Get_Response',
      type: 'object',
      properties: { a: { type: 'string' } },
      required: ['a'],
      additionalProperties: false
    },
    {
      $id: 'HelloworldController_Post_Response',
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
  ]
};
