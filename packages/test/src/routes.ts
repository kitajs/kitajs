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

export const KitaConfig = Object.freeze({
  tsconfig: './tsconfig.json',
  params: { AuthParam: './src/helpers/auth-param' },
  controllers: {
    glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
    prefix: '(?:src)?/?(routes/?)'
  },
  routes: { output: './src/routes.ts', template: '@kitajs/generator/templates/default.hbs' }
});

export const KitaSchema = Object.freeze({
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    'def-structure--311-326--305-327--297-327--136-751--0-752': {
      type: 'object',
      properties: { age: { type: 'number' } },
      required: ['age'],
      additionalProperties: false
    },
    'def-structure--423-438--416-439--328-439--136-751--0-752': {
      type: 'object',
      properties: { age: { type: 'number' } },
      required: ['age'],
      additionalProperties: false
    }
  }
});

export const Kita = fp<{ context: ProvidedRouteContext }>((fastify, options) => {
  const context: RouteContext = { ...options.context, config: KitaConfig, fastify };

  fastify.addSchema(KitaSchema);

  fastify.get(
    '/hello-world',
    {
      schema: {
        operationId: 'listUser',
        querystring: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name']
        }
      },
      preHandler: HelloworldController.a,
      bodyLimit: 1000,
      config: { a: [{ 3: 923 }, ','] }
    },
    async (request, reply) => {
      const data = await HelloworldController.get.apply(context, [
        (request.query as { name: string })['name']
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
  );

  fastify.post(
    '/:name',
    {
      schema: {
        operationId: 'postUser',
        params: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name']
        },
        body: {
          $ref: '#/definitions/def-structure--311-326--305-327--297-327--136-751--0-752'
        },
        querystring: {
          $ref: '#/definitions/def-structure--423-438--416-439--328-439--136-751--0-752'
        }
      }
    },
    async (request, reply) => {
      const param7 = await AuthParam.call(context, request, reply, ['jwt']);

      if (reply.sent) {
        return;
      }

      const param8 = await AuthParam.call(context, request, reply, ['basic']);

      if (reply.sent) {
        return;
      }

      const data = await $name$Controller.post.apply(context, [
        (request.params as { name: string })['name'],
        request.cookies?.cookie,
        request.body as { age: number },
        request.query as { age: number },
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
  );
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
      schema: {
        operationId: 'listUser',
        querystring: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name']
        }
      },
      parameters: [{ value: "(request.query as { name: string })['name']" }],
      options:
        "preHandler: HelloworldController.a,\n      bodyLimit: 1000,\n      config: { a: [{ 3: 923 }, ','] },"
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
        body: {
          $ref: '#/definitions/def-structure--311-326--305-327--297-327--136-751--0-752'
        },
        querystring: {
          $ref: '#/definitions/def-structure--423-438--416-439--328-439--136-751--0-752'
        }
      },
      parameters: [
        { value: "(request.params as { name: string })['name']" },
        { value: 'request.cookies?.cookie' },
        { value: 'request.body as { age: number }' },
        { value: 'request.query as { age: number }' },
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
  schema: {
    $schema: 'http://json-schema.org/draft-07/schema#',
    definitions: {
      'def-structure--311-326--305-327--297-327--136-751--0-752': {
        type: 'object',
        properties: { age: { type: 'number' } },
        required: ['age'],
        additionalProperties: false
      },
      'def-structure--423-438--416-439--328-439--136-751--0-752': {
        type: 'object',
        properties: { age: { type: 'number' } },
        required: ['age'],
        additionalProperties: false
      }
    }
  }
};
