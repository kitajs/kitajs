// Required
import type { RouteContext, ProvidedRouteContext } from '@kitajs/runtime';
import fp from 'fastify-plugin';

// Addons
import '@fastify/swagger';
import '@fastify/cookie';

// Controllers
import * as HelloworldController from './routes/hello-world';
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
  const context: RouteContext = { ...options.context, config: KitaConfig, fastify };

  fastify.addSchema({
    $id: 'B',
    type: 'object',
    properties: { a: { type: 'string' }, b: { type: 'number' } },
    required: ['a', 'b'],
    additionalProperties: false
  });

  fastify.addSchema({
    $id: 'Extended',
    type: 'object',
    properties: { a: { type: 'number' }, b: { type: 'number' } },
    required: ['a', 'b'],
    additionalProperties: false
  });

  fastify.route({
    method: 'GET',
    url: '/hello-world',
    schema: { operationId: 'listUser', querystring: { $ref: 'Extended' } },
    handler: async (request, reply) => {
      const data = await HelloworldController.get.apply(context, [
        request.query as Parameters<typeof HelloworldController.get>[0]
      ]);

      if (reply.sent) {
        if (data) {
          const error = new Error('Reply already sent, but controller returned data');
          //@ts-expect-error - TODO: generate better error message
          error.data = data;
          throw error;
        }

        return;
      }

      return data;
    },
    preHandler: HelloworldController.a,
    bodyLimit: 1000,
    config: {
      a: [{ 3: 923 }, ',']
    }
  });

  fastify.route({
    method: 'POST',
    url: '/:name',
    schema: {
      operationId: 'postUser',
      params: {
        type: 'object',
        properties: { name: { type: 'string' } },
        required: ['name']
      },
      body: { $ref: 'B' },
      querystring: { $ref: 'B' }
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
        request.cookies?.cookie,
        request.body as Parameters<typeof $name$Controller.post>[2],
        request.query as Parameters<typeof $name$Controller.post>[3],
        request,
        reply,
        param7,
        param8
      ]);

      if (reply.sent) {
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
      "import * as HelloworldController from './routes/hello-world';",
      "import * as $name$Controller from './routes/[name]';"
    ],
    params: ["import AuthParam from './helpers/auth-param';"],
    addons: ["import '@fastify/swagger';", "import '@fastify/cookie';"]
  },
  routes: [
    {
      method: 'get',
      controllerName: 'HelloworldController',
      path: '/hello-world',
      schema: { operationId: 'listUser', querystring: { $ref: 'Extended' } },
      parameters: [
        { value: '(request.query as Parameters<typeof HelloworldController.get>[0])' }
      ],
      options:
        "preHandler: HelloworldController.a,\n      bodyLimit: 1000,\n      config: { \n        a: [{ 3: 923 }, ','] },"
    },
    {
      method: 'post',
      controllerName: '$name$Controller',
      path: '/:name',
      schema: {
        operationId: 'postUser',
        params: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name']
        },
        body: { $ref: 'B' },
        querystring: { $ref: 'B' }
      },
      parameters: [
        {
          helper: '',
          value:
            "(request.params as { ['name']: Parameters<typeof $name$Controller.post>[0] })['name']"
        },
        { value: 'request.cookies?.cookie' },
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
      options: ''
    }
  ],
  schemas: [
    {
      $id: 'B',
      type: 'object',
      properties: { a: { type: 'string' }, b: { type: 'number' } },
      required: ['a', 'b'],
      additionalProperties: false
    },
    {
      $id: 'Extended',
      type: 'object',
      properties: { a: { type: 'number' }, b: { type: 'number' } },
      required: ['a', 'b'],
      additionalProperties: false
    }
  ]
};
