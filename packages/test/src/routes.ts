import type { RouteContext, ProvidedRouteContext } from '@kita/runtime';
import { RouterUtils } from '@kita/runtime';
import type { FastifyInstance } from 'fastify';

import '@fastify/cookie';
import * as $name$Controller from './api/[name]';
import AuthParam from './params/auth';

export const KitaConfig = Object.freeze({
  tsconfig: './tsconfig.json',
  params: { AuthParam: './src/params/auth' },
  controllers: { glob: ['src/api/**/*.ts', 'api/**/*.ts'], prefix: '(?:src)?/?(api/?)' },
  routes: { output: './src/routes.ts', template: '@kita/generator/templates/default.hbs' }
});

export function applyRouter(
  fastify: FastifyInstance,
  providedContext: ProvidedRouteContext
) {
  const context: RouteContext = { ...providedContext, config: KitaConfig };

  fastify.post(
    '/:name',
    {
      schema: {
        params: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name']
        },
        body: {
          type: 'object',
          properties: { path: {}, bodyProp: {} },
          required: ['path', 'bodyProp']
        },
        querystring: {
          type: 'object',
          properties: { age: { type: 'string' }, paramQuery: { type: 'string' } },
          required: ['age', 'paramQuery']
        }
      }
    },
    async (request, reply) => {
      const param11 = await AuthParam.call(context, request, reply, ['jwt']);

      if (reply.sent) {
        return undefined as any;
      }

      const param12 = await AuthParam.call(context, request, reply, ['basic']);

      if (reply.sent) {
        return undefined as any;
      }

      const promise = $name$Controller.post.apply(context, [
        (request.params as { name: string })['name'],
        request.cookies?.cookie,
        request.body as { age: number },
        (request.body as { path: number }).path,
        (request.body as { bodyProp: number }).bodyProp,
        request.query as { age: number },
        (request.query as { age: string })['age'],
        (request.query as { paramQuery: string })['paramQuery'],
        request,
        reply,
        param11,
        param12
      ]);

      return RouterUtils.sendResponse.call(context, request, reply, promise);
    }
  );
}

export const HBS_CONF = {
  config: {
    tsconfig: './tsconfig.json',
    params: { AuthParam: './src/params/auth' },
    controllers: {
      glob: ['src/api/**/*.ts', 'api/**/*.ts'],
      prefix: '(?:src)?/?(api/?)'
    },
    routes: {
      output: './src/routes.ts',
      template: '@kita/generator/templates/default.hbs'
    }
  },
  imports: {
    controllers: ["import * as $name$Controller from './api/[name]';"],
    params: ["import AuthParam from './params/auth';"],
    addons: ["import '@fastify/cookie';"]
  },
  routes: [
    {
      method: 'post',
      controllerName: '$name$Controller',
      path: '/:name',
      config: {
        schema: {
          params: {
            type: 'object',
            properties: { name: { type: 'string' } },
            required: ['name']
          },
          body: {
            type: 'object',
            properties: { path: {}, bodyProp: {} },
            required: ['path', 'bodyProp']
          },
          querystring: {
            type: 'object',
            properties: { age: { type: 'string' }, paramQuery: { type: 'string' } },
            required: ['age', 'paramQuery']
          }
        }
      },
      parameters: [
        { value: "(request.params as { name: string })['name']" },
        { value: 'request.cookies?.cookie' },
        { value: 'request.body as { age: number }' },
        { value: '(request.body as { path: number }).path' },
        { value: '(request.body as { bodyProp: number }).bodyProp' },
        { value: 'request.query as { age: number }' },
        { value: "(request.query as { age: string })['age']" },
        { value: "(request.query as { paramQuery: string })['paramQuery']" },
        { value: 'request' },
        { value: 'reply' },
        {
          helper:
            "const param11 = await AuthParam.call(context, request, reply, ['jwt']);",
          value: 'param11'
        },
        {
          helper:
            "const param12 = await AuthParam.call(context, request, reply, ['basic']);",
          value: 'param12'
        }
      ]
    }
  ]
};
