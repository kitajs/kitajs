// Required
import type { RouteContext, ProvidedRouteContext } from '@kitajs/runtime';
import fp from 'fastify-plugin';

// Addons
import '@fastify/swagger';
import '@fastify/cookie';

// Controllers
import * as ResponseTypes2Controller from './routes/response-types-2';
import * as ResponseTypesController from './routes/response-types';
import * as $name$Controller from './routes/[name]';

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
  const context: RouteContext = { config: KitaConfig, fastify, ...options.context };

  fastify.addSchema({
    $id: 'NameQuery',
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    },
    required: ['name'],
    additionalProperties: false
  });

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
    $id: 'ResponseTypes2Controller_Get_Response',
    type: 'object',
    properties: {
      f: {
        $ref: 'Result'
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

  fastify.addSchema({
    $id: 'ResponseTypesController_Get_Response',
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
    $id: 'ResponseTypesController_Post_Response',
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
    $id: '$name$Controller_post_Response',
    type: 'object',
    properties: {
      path: {
        type: 'string'
      },
      cookie: {
        type: 'string'
      },
      body: {
        $ref: 'NameQuery'
      },
      query: {
        $ref: 'NameQuery'
      },
      authJwt: {
        $ref: 'Result'
      },
      authBasic: {
        $ref: 'Result'
      }
    },
    required: ['path', 'cookie', 'body', 'query', 'authJwt', 'authBasic'],
    additionalProperties: false
  });

  fastify.route({
    method: 'GET',
    url: '/response-types-2',
    schema: {
      operationId: 'withCustomParameterResponse',
      response: { default: { $ref: 'ResponseTypes2Controller_Get_Response' } }
    },
    handler: async (request, reply) => {
      const param1 = await AuthParam.call(context, request, reply, ['jwt']);

      if (reply.sent) {
        return;
      }

      const data = await ResponseTypes2Controller.Get.apply(context, [param1]);

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
    method: 'POST',
    url: '/response-types-2',
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
    url: '/response-types',
    schema: {
      operationId: 'withTypedPromiseResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'ResponseTypesController_Get_Response' } }
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
    url: '/response-types',
    schema: {
      operationId: 'withInferredResponse',
      querystring: { $ref: 'HelloWorldQuery' },
      response: { default: { $ref: 'ResponseTypesController_Post_Response' } }
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
    }
  });

  fastify.route({
    method: 'PUT',
    url: '/response-types',
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
    url: '/response-types',
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
    method: 'POST',
    url: '/:name',
    schema: {
      operationId: 'fullExample',
      params: {
        type: 'object',
        properties: { name: { type: 'string' } },
        required: ['name']
      },
      body: { $ref: 'NameQuery' },
      querystring: { $ref: 'NameQuery' },
      response: { default: { $ref: '$name$Controller_post_Response' } }
    },
    handler: async (request, reply) => {
      const param7 = await AuthParam.call(context, request, reply, ['jwt']);

      if (reply.sent) {
        return;
      }

      const param8 = await AuthParam.call(context, request, reply, ['basic']);

      if (reply.sent) {
        return;
      }

      const data = await $name$Controller.post.apply(context, [
        (request.params as { ['name']: Parameters<typeof $name$Controller.post>[0] })[
          'name'
        ],
        request.cookies?.cookie!,
        request.body as Parameters<typeof $name$Controller.post>[2],
        request.query as Parameters<typeof $name$Controller.post>[3],
        request,
        reply,
        param7,
        param8
      ]);

      if (reply.sent) {
        //@ts-ignore - When $name$Controller.post() returns nothing, typescript gets mad.
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
      "import * as ResponseTypes2Controller from './routes/response-types-2';",
      "import * as ResponseTypesController from './routes/response-types';",
      "import * as $name$Controller from './routes/[name]';"
    ],
    params: ["import AuthParam from './helpers/auth-param';"],
    addons: ["import '@fastify/swagger';", "import '@fastify/cookie';"]
  },
  routes: [
    {
      method: 'Get',
      controllerName: 'ResponseTypes2Controller',
      path: '/response-types-2',
      schema: {
        operationId: 'withCustomParameterResponse',
        response: { default: { $ref: 'ResponseTypes2Controller_Get_Response' } }
      },
      parameters: [
        {
          helper:
            "const param1 = await AuthParam.call(context, request, reply, ['jwt']);",
          value: 'param1'
        }
      ],
      options: '',
      controllerFile: 'src/routes/response-types-2.ts:17:26',
      operationId: 'withCustomParameterResponse'
    },
    {
      method: 'Post',
      controllerName: 'ResponseTypes2Controller',
      path: '/response-types-2',
      schema: {
        operationId: 'withImportedResponseType',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'HWData' } }
      },
      parameters: [
        {
          value: '(request.query as Parameters<typeof ResponseTypes2Controller.Post>[0])'
        }
      ],
      options: '',
      controllerFile: 'src/routes/response-types-2.ts:6:27',
      operationId: 'withImportedResponseType'
    },
    {
      method: 'Get',
      controllerName: 'ResponseTypesController',
      path: '/response-types',
      schema: {
        operationId: 'withTypedPromiseResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'ResponseTypesController_Get_Response' } }
      },
      parameters: [
        { value: '(request.query as Parameters<typeof ResponseTypesController.Get>[0])' }
      ],
      options: '',
      controllerFile: 'src/routes/response-types.ts:5:26',
      operationId: 'withTypedPromiseResponse'
    },
    {
      method: 'Post',
      controllerName: 'ResponseTypesController',
      path: '/response-types',
      schema: {
        operationId: 'withInferredResponse',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'ResponseTypesController_Post_Response' } }
      },
      parameters: [
        { value: '(request.query as Parameters<typeof ResponseTypesController.Post>[0])' }
      ],
      options: '',
      controllerFile: 'src/routes/response-types.ts:14:27',
      operationId: 'withInferredResponse'
    },
    {
      method: 'Put',
      controllerName: 'ResponseTypesController',
      path: '/response-types',
      schema: {
        operationId: 'withPromiseTypeAlias',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'PR' } }
      },
      parameters: [
        { value: '(request.query as Parameters<typeof ResponseTypesController.Put>[0])' }
      ],
      options: '',
      controllerFile: 'src/routes/response-types.ts:25:26',
      operationId: 'withPromiseTypeAlias'
    },
    {
      method: 'Delete',
      controllerName: 'ResponseTypesController',
      path: '/response-types',
      schema: {
        operationId: 'withTypeAliasPromise',
        querystring: { $ref: 'HelloWorldQuery' },
        response: { default: { $ref: 'DR' } }
      },
      parameters: [
        {
          value: '(request.query as Parameters<typeof ResponseTypesController.Delete>[0])'
        }
      ],
      options: '',
      controllerFile: 'src/routes/response-types.ts:36:29',
      operationId: 'withTypeAliasPromise'
    },
    {
      method: 'post',
      controllerName: '$name$Controller',
      path: '/:name',
      schema: {
        operationId: 'fullExample',
        params: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name']
        },
        body: { $ref: 'NameQuery' },
        querystring: { $ref: 'NameQuery' },
        response: { default: { $ref: '$name$Controller_post_Response' } }
      },
      parameters: [
        {
          helper: '',
          value:
            "(request.params as { ['name']: Parameters<typeof $name$Controller.post>[0] })['name']"
        },
        { value: 'request.cookies?.cookie!' },
        { value: 'request.body as Parameters<typeof $name$Controller.post>[2]' },
        { value: '(request.query as Parameters<typeof $name$Controller.post>[3])' },
        { value: 'request' },
        { value: 'reply' },
        {
          helper:
            "const param7 = await AuthParam.call(context, request, reply, ['jwt']);",
          value: 'param7'
        },
        {
          helper:
            "const param8 = await AuthParam.call(context, request, reply, ['basic']);",
          value: 'param8'
        }
      ],
      options: '',
      controllerFile: 'src/routes/[name].ts:7:27',
      operationId: 'fullExample'
    }
  ],
  schemas: [
    {
      $id: 'NameQuery',
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
      additionalProperties: false
    },
    {
      $id: 'HelloWorldQuery',
      type: 'object',
      properties: { name: { type: 'string' }, age: { type: 'number' } },
      required: ['name', 'age'],
      additionalProperties: false
    },
    {
      $id: 'ResponseTypes2Controller_Get_Response',
      type: 'object',
      properties: { f: { $ref: 'Result' } },
      required: ['f'],
      additionalProperties: false
    },
    { $id: 'Result', type: 'string', enum: ['ok', 'error'] },
    {
      $id: 'HWData',
      type: 'object',
      properties: { e: { type: 'string' } },
      required: ['e'],
      additionalProperties: false
    },
    {
      $id: 'ResponseTypesController_Get_Response',
      type: 'object',
      properties: { a: { type: 'string' } },
      required: ['a'],
      additionalProperties: false
    },
    {
      $id: 'ResponseTypesController_Post_Response',
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
      $id: '$name$Controller_post_Response',
      type: 'object',
      properties: {
        path: { type: 'string' },
        cookie: { type: 'string' },
        body: { $ref: 'NameQuery' },
        query: { $ref: 'NameQuery' },
        authJwt: { $ref: 'Result' },
        authBasic: { $ref: 'Result' }
      },
      required: ['path', 'cookie', 'body', 'query', 'authJwt', 'authBasic'],
      additionalProperties: false
    }
  ]
};
