// This file contains hardcoded paths to controllers ans schemas.
// It should be in your .gitignore and NOT be committed to source control.

import Piscina from 'piscina';

/**
 * The filename to be used when creating a Piscina instance.
 *
 * @example
 * import { filename } from './routes';
 * const piscina = new Piscina({ filename });
 */
export const filename = __filename;

if (Piscina.isWorkerThread) {
  const controllers: Record<string, Record<string, Function>> = {};

  module.exports.asyncTest = async (args: any[]) => {
    if (!controllers['AsyncController']) {
      controllers['AsyncController'] = require('./routes/async');
    }

    return controllers['AsyncController']!.get!.apply(undefined, args);
  };

  //@ts-expect-error - NodeJS modules are wrapped into a function, so this return will work.
  return;
}

import '@fastify/swagger';
import type { KitaConfig } from '@kitajs/runtime';
import fp from 'fastify-plugin';
//@ts-ignore - we may have import type errors
import '@fastify/cookie';
//@ts-ignore - we may have import type errors
import * as AsyncController from './routes/async';
//@ts-ignore - we may have import type errors
import * as HelloWorldController from './routes/hello-world';
//@ts-ignore - we may have import type errors
import * as PrimitiveTypesController from './routes/primitive-types';
//@ts-ignore - we may have import type errors
import * as ResponseTypesController from './routes/response-types';
//@ts-ignore - we may have import type errors
import * as ThisController from './routes/this';
//@ts-ignore - we may have import type errors
import * as _name_Controller from './routes/[name]';
//@ts-ignore - we may have import type errors
import AuthParam from './helpers/auth-param';

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
export const Kita = fp<{ piscina: Piscina }>(
  (fastify, options) => {
    // Default piscina instance, you can override it in the options.
    options.piscina ??= new Piscina({ filename: __filename });

    fastify.addSchema({
      $id: 'ResponseTypesControllerGetResponse',
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
      $id: 'ResponseTypesControllerPostResponse',
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
      $id: 'def-structure--371-385--364-386--361-386--286-406--0-407',
      type: 'object',
      properties: {
        a: {
          type: 'number',
          const: 1
        },
        b: {
          type: 'number',
          const: 2
        }
      },
      required: ['a', 'b'],
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

    fastify.POST(
      '/:name',
      {
        schema: {
          operationId: 'fullExampleExclusiveQuery',
          response: { default: { type: 'number' } },
          description: 'route description 2',
          security: [{ default: [] }, { admin: ['read-user', 'write user', '4', '76'] }],
          tags: ['test tag 2'],
          summary: 'route summary 2',
          params: {
            type: 'object',
            properties: { name: { type: 'string' } },
            required: ['name'],
            additionalProperties: false
          },
          body: { $ref: 'NameQuery' },
          querystring: { $ref: 'NameQuery' }
        }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        const authJwt = await AuthParam.call(context, request, reply, 'jwt');

        if (reply.sent) {
          return;
        }

        const authBasic = await AuthParam.call(context, request, reply, 'basic');

        if (reply.sent) {
          return;
        }

        return _name_Controller.post.apply(context, [
          (request.params as { ['name']: Parameters<typeof _name_Controller.post>[0] })[
            'name'
          ],
          request.cookies?.cookie,
          request.body as Parameters<typeof _name_Controller.post>[2],
          request.query as Parameters<typeof _name_Controller.post>[3],
          request,
          reply,
          authJwt,
          authBasic
        ]);
      }
    );

    fastify.GET(
      '/async',
      {
        schema: { operationId: 'asyncTest', response: { default: { type: 'null' } } }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return options.piscina.run([], { name: 'asyncTest' });
      }
    );

    fastify.POST(
      '/async',
      {
        schema: { operationId: 'syncTest', response: { default: { type: 'null' } } }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return AsyncController.post.apply(context, []);
      }
    );

    fastify.GET(
      '/hello-world',
      {
        schema: {
          operationId: 'HelloWorldControllerGet',
          response: { default: { type: 'string' } },
          description: 'Hello world rest API endpoint.',
          querystring: {
            type: 'object',
            properties: { name: { type: 'string' } },
            required: [],
            additionalProperties: false
          }
        }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return HelloWorldController.get.apply(context, [
          (request.query as { ['name']?: string })['name']
        ]);
      }
    );

    fastify.POST(
      '/primitive-types',
      {
        schema: {
          operationId: 'primitiveComplexQuery',
          response: { default: { type: 'boolean' } },
          description: 'primitive complex queries',
          body: { type: 'array', items: { type: ['string', 'number'] } },
          querystring: {
            type: 'object',
            properties: {
              param: { anyOf: [{ type: 'string' }, { not: {} }] },
              parm2: { type: ['boolean', 'number', 'null'] }
            },
            required: ['param', 'parm2'],
            additionalProperties: false
          }
        }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return PrimitiveTypesController.post.apply(context, [
          request.body as Parameters<typeof PrimitiveTypesController.post>[0],
          (request.query as { ['param']: string | undefined })['param'],
          (request.query as { ['parm2']: boolean | number | null })['parm2']
        ]);
      }
    );

    fastify.GET(
      '/primitive-types',
      {
        schema: {
          operationId: 'extendedQuery',
          response: { default: { type: 'boolean' } },
          description: 'extended queries',
          querystring: {
            $ref: 'def-structure--371-385--364-386--361-386--286-406--0-407'
          }
        }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return PrimitiveTypesController.get.apply(context, [
          request.query as Parameters<typeof PrimitiveTypesController.get>[0]
        ]);
      }
    );

    fastify.GET(
      '/response-types',
      {
        schema: {
          operationId: 'withTypedPromiseResponse',
          response: { default: { $ref: 'ResponseTypesControllerGetResponse' } },
          tags: ['Response Test'],
          querystring: { $ref: 'HelloWorldQuery' }
        }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return ResponseTypesController.Get.apply(context, [
          request.query as Parameters<typeof ResponseTypesController.Get>[0]
        ]);
      }
    );

    fastify.POST(
      '/response-types',
      {
        schema: {
          operationId: 'withInferredResponse',
          response: { default: { $ref: 'ResponseTypesControllerPostResponse' } },
          tags: ['Response Test'],
          querystring: { $ref: 'HelloWorldQuery' }
        },
        preHandler: ResponseTypesController.preHandler
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return ResponseTypesController.Post.apply(context, [
          request.query as Parameters<typeof ResponseTypesController.Post>[0]
        ]);
      }
    );

    fastify.PUT(
      '/response-types',
      {
        schema: {
          operationId: 'withPromiseTypeAlias',
          response: { default: { $ref: 'PR' } },
          tags: ['Response Test'],
          querystring: { $ref: 'HelloWorldQuery' }
        }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return ResponseTypesController.Put.apply(context, [
          request.query as Parameters<typeof ResponseTypesController.Put>[0]
        ]);
      }
    );

    fastify.DELETE(
      '/response-types',
      {
        schema: {
          operationId: 'withTypeAliasPromise',
          response: { default: { $ref: 'DR' } },
          tags: ['Response Test'],
          querystring: { $ref: 'HelloWorldQuery' }
        }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return ResponseTypesController.Delete.apply(context, [
          request.query as Parameters<typeof ResponseTypesController.Delete>[0]
        ]);
      }
    );

    fastify.GET(
      '/this',
      {
        schema: { operationId: 'getId', response: { default: { type: 'boolean' } } },
        ...ThisController.getConfig
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return ThisController.get.apply(context, []);
      }
    );

    fastify.POST(
      '/this',
      {
        schema: {
          operationId: 'withSubTypeofs',
          response: { default: { type: 'boolean' } }
        },
        onRequest: [...ThisController.auth, ...ThisController.auth2]
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return ThisController.post.apply(context, []);
      }
    );

    fastify.DELETE(
      '/this',
      {
        schema: { operationId: 'withImport', response: { default: { type: 'boolean' } } },
        onRequest: require('./helpers/on-request').myCustomHook
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return ThisController.Delete.apply(context, []);
      }
    );

    // Ensure this function remains a "async" function
    return Promise.resolve();
  },
  {
    name: 'Kita',
    fastify: '4.x',
    // Ensure prefixes are applied to all routes
    encapsulate: true
  }
);

/**
 * This is the resolved config that was used during code generation. JIC its needed at runtime.
 */
export const ResolvedConfig = {
  params: { AuthParam: '/www/kita/packages/test-package/src/helpers/auth-param' },
  tsconfig: './tsconfig.json',
  controllers: {
    glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
    prefix: '(?:.*src)?/?(?:routes/?)'
  },
  routes: {
    output: '/www/kita/packages/test-package/src/routes.ts',
    format: {
      parser: 'typescript',
      arrowParens: 'always',
      bracketSpacing: true,
      endOfLine: 'lf',
      insertPragma: false,
      bracketSameLine: false,
      jsxSingleQuote: false,
      printWidth: 90,
      proseWrap: 'always',
      quoteProps: 'as-needed',
      requirePragma: false,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'none',
      useTabs: false,
      vueIndentScriptAndStyle: false,
      plugins: [
        '/www/kita/node_modules/prettier-plugin-packagejson/lib/index.js',
        '/www/kita/node_modules/prettier-plugin-jsdoc/dist/index.js',
        '/www/kita/node_modules/prettier-plugin-organize-imports/index.js'
      ]
    },
    exportAST: true,
    exportConfig: true,
    exportControllers: true
  },
  schema: {
    defaultResponse: 'default',
    responses: {},
    generator: {
      encodeRefs: true,
      sortProps: true,
      strictTuples: true,
      jsDoc: 'extended',
      parsers: [],
      formatters: []
    }
  }
} as KitaConfig;

export * as AsyncController from './routes/async';
export * as HelloWorldController from './routes/hello-world';
export * as PrimitiveTypesController from './routes/primitive-types';
export * as ResponseTypesController from './routes/response-types';
export * as ThisController from './routes/this';
export * as _name_Controller from './routes/[name]';

/**
 * The extracted data from your controllers and configurations for this template hydration.
 * In case you need some metadata at runtime, this is the place to look.
 */
export const KitaAST = {
  config: {
    params: { AuthParam: '/www/kita/packages/test-package/src/helpers/auth-param' },
    tsconfig: './tsconfig.json',
    controllers: {
      glob: ['src/routes/**/*.ts', 'routes/**/*.ts'],
      prefix: '(?:.*src)?/?(?:routes/?)'
    },
    routes: {
      output: '/www/kita/packages/test-package/src/routes.ts',
      format: {
        parser: 'typescript',
        arrowParens: 'always',
        bracketSpacing: true,
        endOfLine: 'lf',
        insertPragma: false,
        bracketSameLine: false,
        jsxSingleQuote: false,
        printWidth: 90,
        proseWrap: 'always',
        quoteProps: 'as-needed',
        requirePragma: false,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'none',
        useTabs: false,
        vueIndentScriptAndStyle: false,
        plugins: [
          '/www/kita/node_modules/prettier-plugin-packagejson/lib/index.js',
          '/www/kita/node_modules/prettier-plugin-jsdoc/dist/index.js',
          '/www/kita/node_modules/prettier-plugin-organize-imports/index.js'
        ]
      },
      exportAST: true,
      exportConfig: true,
      exportControllers: true
    },
    schema: {
      defaultResponse: 'default',
      responses: {},
      generator: {
        encodeRefs: true,
        sortProps: true,
        strictTuples: true,
        jsDoc: 'extended',
        parsers: [],
        formatters: []
      }
    }
  },
  routes: [
    {
      controllerMethod: 'post',
      method: 'POST',
      controllerName: '_name_Controller',
      url: '/:name',
      controllerPath: 'src/routes/[name].ts:43',
      parameters: [
        {
          value:
            "(request.params as { ['name']: Parameters<typeof _name_Controller.post>[0] })['name']"
        },
        { value: 'request.cookies?.cookie' },
        { value: 'request.body as Parameters<typeof _name_Controller.post>[2]' },
        { value: '(request.query as Parameters<typeof _name_Controller.post>[3])' },
        { value: 'request' },
        { value: 'reply' },
        {
          value: 'authJwt',
          helper: "const authJwt = await AuthParam.call(context, request, reply, 'jwt');"
        },
        {
          value: 'authBasic',
          helper:
            "const authBasic = await AuthParam.call(context, request, reply, 'basic');"
        }
      ],
      schema: {
        operationId: 'fullExampleExclusiveQuery',
        response: { default: { type: 'number' } },
        description: 'route description 2',
        security: [{ default: [] }, { admin: ['read-user', 'write user', '4', '76'] }],
        tags: ['test tag 2'],
        summary: 'route summary 2',
        params: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name'],
          additionalProperties: false
        },
        body: { $ref: 'NameQuery' },
        querystring: { $ref: 'NameQuery' }
      },
      rendered:
        'fastify.POST(\n  \'/:name\',\n  {\n    schema: {"operationId":"fullExampleExclusiveQuery","response":{"default":{"type":"number"}},"description":"route description 2","security":[{"default":[]},{"admin":["read-user","write user","4","76"]}],"tags":["test tag 2"],"summary":"route summary 2","params":{"type":"object","properties":{"name":{"type":"string"}},"required":["name"],"additionalProperties":false},"body":{"$ref":"NameQuery"},"querystring":{"$ref":"NameQuery"}},\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n        const authJwt = await AuthParam.call(context, request, reply, \'jwt\');\n\n        if (reply.sent) {\n          return;\n        }\n\n        const authBasic = await AuthParam.call(context, request, reply, \'basic\');\n\n        if (reply.sent) {\n          return;\n        }\n\n\n    return _name_Controller.post.apply(context, [(request.params as { [\'name\']: Parameters<typeof _name_Controller.post>[0] })[\'name\'],request.cookies?.cookie,request.body as Parameters<typeof _name_Controller.post>[2],(request.query as Parameters<typeof _name_Controller.post>[3]),request,reply,authJwt,authBasic]);\n  }\n);',
      operationId: 'fullExampleExclusiveQuery'
    },
    {
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'AsyncController',
      url: '/async',
      controllerPath: 'src/routes/async.ts:5',
      parameters: [],
      schema: { operationId: 'asyncTest', response: { default: { type: 'null' } } },
      rendered:
        'fastify.GET(\n  \'/async\',\n  {\n    schema: {"operationId":"asyncTest","response":{"default":{"type":"null"}}},\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return options.piscina.run([], { name: \'asyncTest\' });\n  }\n);',
      importablePath: './routes/async',
      async: true,
      operationId: 'asyncTest'
    },
    {
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'AsyncController',
      url: '/async',
      controllerPath: 'src/routes/async.ts:10',
      parameters: [],
      schema: { operationId: 'syncTest', response: { default: { type: 'null' } } },
      rendered:
        'fastify.POST(\n  \'/async\',\n  {\n    schema: {"operationId":"syncTest","response":{"default":{"type":"null"}}},\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return AsyncController.post.apply(context, []);\n  }\n);',
      operationId: 'syncTest'
    },
    {
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'HelloWorldController',
      url: '/hello-world',
      controllerPath: 'src/routes/hello-world.ts:6',
      parameters: [{ value: "(request.query as { ['name']?: string })['name']" }],
      schema: {
        operationId: 'HelloWorldControllerGet',
        response: { default: { type: 'string' } },
        description: 'Hello world rest API endpoint.',
        querystring: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: [],
          additionalProperties: false
        }
      },
      rendered:
        'fastify.GET(\n  \'/hello-world\',\n  {\n    schema: {"operationId":"HelloWorldControllerGet","response":{"default":{"type":"string"}},"description":"Hello world rest API endpoint.","querystring":{"type":"object","properties":{"name":{"type":"string"}},"required":[],"additionalProperties":false}},\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return HelloWorldController.get.apply(context, [(request.query as { [\'name\']?: string })[\'name\']]);\n  }\n);'
    },
    {
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'PrimitiveTypesController',
      url: '/primitive-types',
      controllerPath: 'src/routes/primitive-types.ts:4',
      parameters: [
        { value: 'request.body as Parameters<typeof PrimitiveTypesController.post>[0]' },
        { value: "(request.query as { ['param']: string | undefined })['param']" },
        { value: "(request.query as { ['parm2']: boolean | number | null })['parm2']" }
      ],
      schema: {
        operationId: 'primitiveComplexQuery',
        response: { default: { type: 'boolean' } },
        description: 'primitive complex queries',
        body: { type: 'array', items: { type: ['string', 'number'] } },
        querystring: {
          type: 'object',
          properties: {
            param: { anyOf: [{ type: 'string' }, { not: {} }] },
            parm2: { type: ['boolean', 'number', 'null'] }
          },
          required: ['param', 'parm2'],
          additionalProperties: false
        }
      },
      rendered:
        'fastify.POST(\n  \'/primitive-types\',\n  {\n    schema: {"operationId":"primitiveComplexQuery","response":{"default":{"type":"boolean"}},"description":"primitive complex queries","body":{"type":"array","items":{"type":["string","number"]}},"querystring":{"type":"object","properties":{"param":{"anyOf":[{"type":"string"},{"not":{}}]},"parm2":{"type":["boolean","number","null"]}},"required":["param","parm2"],"additionalProperties":false}},\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return PrimitiveTypesController.post.apply(context, [request.body as Parameters<typeof PrimitiveTypesController.post>[0],(request.query as { [\'param\']: string | undefined })[\'param\'],(request.query as { [\'parm2\']: boolean | number | null })[\'parm2\']]);\n  }\n);',
      operationId: 'primitiveComplexQuery'
    },
    {
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'PrimitiveTypesController',
      url: '/primitive-types',
      controllerPath: 'src/routes/primitive-types.ts:14',
      parameters: [
        { value: '(request.query as Parameters<typeof PrimitiveTypesController.get>[0])' }
      ],
      schema: {
        operationId: 'extendedQuery',
        response: { default: { type: 'boolean' } },
        description: 'extended queries',
        querystring: { $ref: 'def-structure--371-385--364-386--361-386--286-406--0-407' }
      },
      rendered:
        'fastify.GET(\n  \'/primitive-types\',\n  {\n    schema: {"operationId":"extendedQuery","response":{"default":{"type":"boolean"}},"description":"extended queries","querystring":{"$ref":"def-structure--371-385--364-386--361-386--286-406--0-407"}},\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return PrimitiveTypesController.get.apply(context, [(request.query as Parameters<typeof PrimitiveTypesController.get>[0])]);\n  }\n);',
      operationId: 'extendedQuery'
    },
    {
      controllerMethod: 'Get',
      method: 'GET',
      controllerName: 'ResponseTypesController',
      url: '/response-types',
      controllerPath: 'src/routes/response-types.ts:6',
      parameters: [
        { value: '(request.query as Parameters<typeof ResponseTypesController.Get>[0])' }
      ],
      schema: {
        operationId: 'withTypedPromiseResponse',
        response: { default: { $ref: 'ResponseTypesControllerGetResponse' } },
        tags: ['Response Test'],
        querystring: { $ref: 'HelloWorldQuery' }
      },
      rendered:
        'fastify.GET(\n  \'/response-types\',\n  {\n    schema: {"operationId":"withTypedPromiseResponse","response":{"default":{"$ref":"ResponseTypesControllerGetResponse"}},"tags":["Response Test"],"querystring":{"$ref":"HelloWorldQuery"}},\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return ResponseTypesController.Get.apply(context, [(request.query as Parameters<typeof ResponseTypesController.Get>[0])]);\n  }\n);',
      operationId: 'withTypedPromiseResponse'
    },
    {
      controllerMethod: 'Post',
      method: 'POST',
      controllerName: 'ResponseTypesController',
      url: '/response-types',
      controllerPath: 'src/routes/response-types.ts:16',
      parameters: [
        { value: '(request.query as Parameters<typeof ResponseTypesController.Post>[0])' }
      ],
      schema: {
        operationId: 'withInferredResponse',
        response: { default: { $ref: 'ResponseTypesControllerPostResponse' } },
        tags: ['Response Test'],
        querystring: { $ref: 'HelloWorldQuery' }
      },
      rendered:
        'fastify.POST(\n  \'/response-types\',\n  {\n    schema: {"operationId":"withInferredResponse","response":{"default":{"$ref":"ResponseTypesControllerPostResponse"}},"tags":["Response Test"],"querystring":{"$ref":"HelloWorldQuery"}},\n    preHandler: ResponseTypesController.preHandler\n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return ResponseTypesController.Post.apply(context, [(request.query as Parameters<typeof ResponseTypesController.Post>[0])]);\n  }\n);',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesController.preHandler'
    },
    {
      controllerMethod: 'Put',
      method: 'PUT',
      controllerName: 'ResponseTypesController',
      url: '/response-types',
      controllerPath: 'src/routes/response-types.ts:28',
      parameters: [
        { value: '(request.query as Parameters<typeof ResponseTypesController.Put>[0])' }
      ],
      schema: {
        operationId: 'withPromiseTypeAlias',
        response: { default: { $ref: 'PR' } },
        tags: ['Response Test'],
        querystring: { $ref: 'HelloWorldQuery' }
      },
      rendered:
        'fastify.PUT(\n  \'/response-types\',\n  {\n    schema: {"operationId":"withPromiseTypeAlias","response":{"default":{"$ref":"PR"}},"tags":["Response Test"],"querystring":{"$ref":"HelloWorldQuery"}},\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return ResponseTypesController.Put.apply(context, [(request.query as Parameters<typeof ResponseTypesController.Put>[0])]);\n  }\n);',
      operationId: 'withPromiseTypeAlias'
    },
    {
      controllerMethod: 'Delete',
      method: 'DELETE',
      controllerName: 'ResponseTypesController',
      url: '/response-types',
      controllerPath: 'src/routes/response-types.ts:40',
      parameters: [
        {
          value: '(request.query as Parameters<typeof ResponseTypesController.Delete>[0])'
        }
      ],
      schema: {
        operationId: 'withTypeAliasPromise',
        response: { default: { $ref: 'DR' } },
        tags: ['Response Test'],
        querystring: { $ref: 'HelloWorldQuery' }
      },
      rendered:
        'fastify.DELETE(\n  \'/response-types\',\n  {\n    schema: {"operationId":"withTypeAliasPromise","response":{"default":{"$ref":"DR"}},"tags":["Response Test"],"querystring":{"$ref":"HelloWorldQuery"}},\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return ResponseTypesController.Delete.apply(context, [(request.query as Parameters<typeof ResponseTypesController.Delete>[0])]);\n  }\n);',
      operationId: 'withTypeAliasPromise'
    },
    {
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'ThisController',
      url: '/this',
      controllerPath: 'src/routes/this.ts:11',
      parameters: [],
      schema: { operationId: 'getId', response: { default: { type: 'boolean' } } },
      rendered:
        'fastify.GET(\n  \'/this\',\n  {\n    schema: {"operationId":"getId","response":{"default":{"type":"boolean"}}},\n    ...ThisController.getConfig\n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return ThisController.get.apply(context, []);\n  }\n);',
      operationId: 'getId',
      options: '...ThisController.getConfig'
    },
    {
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'ThisController',
      url: '/this',
      controllerPath: 'src/routes/this.ts:19',
      parameters: [],
      schema: {
        operationId: 'withSubTypeofs',
        response: { default: { type: 'boolean' } }
      },
      rendered:
        'fastify.POST(\n  \'/this\',\n  {\n    schema: {"operationId":"withSubTypeofs","response":{"default":{"type":"boolean"}}},\n    onRequest: [...ThisController.auth, ...ThisController.auth2]\n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return ThisController.post.apply(context, []);\n  }\n);',
      operationId: 'withSubTypeofs',
      options: 'onRequest: [...ThisController.auth, ...ThisController.auth2]'
    },
    {
      controllerMethod: 'Delete',
      method: 'DELETE',
      controllerName: 'ThisController',
      url: '/this',
      controllerPath: 'src/routes/this.ts:30',
      parameters: [],
      schema: { operationId: 'withImport', response: { default: { type: 'boolean' } } },
      rendered:
        'fastify.DELETE(\n  \'/this\',\n  {\n    schema: {"operationId":"withImport","response":{"default":{"type":"boolean"}}},\n    onRequest: require(\'./helpers/on-request\').myCustomHook\n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return ThisController.Delete.apply(context, []);\n  }\n);',
      operationId: 'withImport',
      options: "onRequest: require('./helpers/on-request').myCustomHook"
    }
  ],
  schemas: [
    {
      $id: 'ResponseTypesControllerGetResponse',
      type: 'object',
      properties: { a: { type: 'string' } },
      required: ['a'],
      additionalProperties: false
    },
    {
      $id: 'ResponseTypesControllerPostResponse',
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
      $id: 'def-structure--371-385--364-386--361-386--286-406--0-407',
      type: 'object',
      properties: { a: { type: 'number', const: 1 }, b: { type: 'number', const: 2 } },
      required: ['a', 'b'],
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
      $id: 'NameQuery',
      type: 'object',
      properties: { name: { type: 'string' } },
      required: ['name'],
      additionalProperties: false
    }
  ],
  imports: [
    "import '@fastify/cookie';",
    "import * as AsyncController from './routes/async';",
    "import * as HelloWorldController from './routes/hello-world';",
    "import * as PrimitiveTypesController from './routes/primitive-types';",
    "import * as ResponseTypesController from './routes/response-types';",
    "import * as ThisController from './routes/this';",
    "import * as _name_Controller from './routes/[name]';",
    "import AuthParam from './helpers/auth-param';"
  ],
  controllers: [
    "export * as _name_Controller from './routes/[name]';",
    "export * as AsyncController from './routes/async';",
    "export * as HelloWorldController from './routes/hello-world';",
    "export * as PrimitiveTypesController from './routes/primitive-types';",
    "export * as ResponseTypesController from './routes/response-types';",
    "export * as ThisController from './routes/this';"
  ],
  hasAsync: true
};
