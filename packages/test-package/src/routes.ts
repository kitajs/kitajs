// This file contains hardcoded paths to controllers ans schemas.
// It should be in your .gitignore and NOT be committed to source control.

import Piscina from 'debug';

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
import * as AuthParam from './helpers/auth-param';
//@ts-ignore - we may have import type errors
import * as HelloWorldController from './routes/hello-world';
//@ts-ignore - we may have import type errors
import * as PrimitiveTypesController from './routes/primitive-types';
//@ts-ignore - we may have import type errors
import * as ResponseTypesController from './routes/response-types';
//@ts-ignore - we may have import type errors
import * as _name_Controller from './routes/[name]';

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
  //@ts-ignore - options may not be used
  async (fastify, options) => {
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
      $id: 'def-structure--294-308--287-309--285-309--239-329--0-330',
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

    fastify.put(
      '/:name',
      {
        schema: {
          operationId: 'fullExampleUsingBody',
          response: { default: { type: 'number' } },
          description: 'Route description 1',
          security: [{ default: [] }, { admin: ['read-user', 'write user', '4', '76'] }],
          tags: ['test tag 1'],
          summary: 'route summary 1',
          params: {
            type: 'object',
            properties: { name: { type: 'string' } },
            required: ['name']
          },
          body: {
            type: 'object',
            properties: { path: { type: 'number' }, bodyProp: { type: 'number' } },
            required: ['path', 'bodyProp']
          },
          querystring: {
            type: 'object',
            properties: {
              paramQuery: { type: 'string' },
              typedQuery: { type: 'boolean' },
              typedAndNamedQuery: { type: 'boolean' }
            },
            required: ['paramQuery', 'typedQuery', 'typedAndNamedQuery']
          }
        }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        const authJwt = await AuthParam.resolver(request, reply, 'jwt');

        if (reply.sent) {
          return;
        }

        const authBasic = await AuthParam.resolver(request, reply, 'basic');

        if (reply.sent) {
          return;
        }

        return _name_Controller.put(
          (request.params as { ['name']: Parameters<typeof _name_Controller.put>[0] })['name'],
          request.cookies?.cookie,
          (request.body as { ['path']: Parameters<typeof _name_Controller.put>[2] }).path,
          (request.body as { ['bodyProp']: Parameters<typeof _name_Controller.put>[3] }).bodyProp,
          (
            request.query as {
              ['paramQuery']: Parameters<typeof _name_Controller.put>[4];
            }
          )['paramQuery'],
          (
            request.query as {
              ['typedQuery']: Parameters<typeof _name_Controller.put>[5];
            }
          )['typedQuery'],
          (
            request.query as {
              ['typedAndNamedQuery']: Parameters<typeof _name_Controller.put>[6];
            }
          )['typedAndNamedQuery'],
          request,
          reply,
          authJwt,
          authBasic
        );
      }
    );

    fastify.post(
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
            required: ['name']
          },
          body: { $ref: 'NameQuery' },
          querystring: { $ref: 'NameQuery' }
        }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        const authJwt = await AuthParam.resolver(request, reply, 'jwt');

        if (reply.sent) {
          return;
        }

        const authBasic = await AuthParam.resolver(request, reply, 'basic');

        if (reply.sent) {
          return;
        }

        return _name_Controller.post(
          (request.params as { ['name']: Parameters<typeof _name_Controller.post>[0] })['name'],
          request.cookies?.cookie,
          request.body as Parameters<typeof _name_Controller.post>[2],
          request.query as Parameters<typeof _name_Controller.post>[3],
          request,
          reply,
          authJwt,
          authBasic
        );
      }
    );

    fastify.get(
      '/async',
      {
        schema: { operationId: 'asyncTest', response: { default: { type: 'null' } } }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return options.piscina.run([], { name: 'asyncTest' });
      }
    );

    fastify.post(
      '/async',
      {
        schema: { operationId: 'syncTest', response: { default: { type: 'null' } } }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return AsyncController.post();
      }
    );

    fastify.get(
      '/hello-world',
      {
        schema: {
          operationId: 'HelloWorldControllerGet',
          response: { default: { type: 'string' } },
          description: 'Hello world rest API endpoint.',
          querystring: {
            type: 'object',
            properties: { name: { type: 'string' } },
            required: []
          }
        }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return HelloWorldController.get(
          (request.query as { ['name']?: Parameters<typeof HelloWorldController.get>[0] })['name']
        );
      }
    );

    fastify.post(
      '/primitive-types',
      {
        schema: {
          operationId: 'PrimitiveTypesControllerPost',
          response: { default: { type: 'boolean' } },
          description: 'primitive complex queries',
          body: { type: 'array', items: { type: ['string', 'number'] } },
          querystring: {
            type: 'object',
            properties: {
              param: { anyOf: [{ type: 'string' }, { not: {} }] },
              parm2: { type: ['boolean', 'number', 'null'] }
            },
            required: ['param', 'parm2']
          }
        }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return PrimitiveTypesController.post(
          request.body as Parameters<typeof PrimitiveTypesController.post>[0],
          (
            request.query as {
              ['param']: Parameters<typeof PrimitiveTypesController.post>[1];
            }
          )['param'],
          (
            request.query as {
              ['parm2']: Parameters<typeof PrimitiveTypesController.post>[2];
            }
          )['parm2']
        );
      }
    );

    fastify.get(
      '/primitive-types',
      {
        schema: {
          operationId: 'PrimitiveTypesControllerGet',
          response: { default: { type: 'boolean' } },
          description: 'extended queries',
          querystring: {
            $ref: 'def-structure--294-308--287-309--285-309--239-329--0-330'
          }
        }
      },
      //@ts-ignore - we may have unused params
      async (request, reply) => {
        return PrimitiveTypesController.get(request.query as Parameters<typeof PrimitiveTypesController.get>[0]);
      }
    );

    fastify.get(
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
        return ResponseTypesController.Get(request.query as Parameters<typeof ResponseTypesController.Get>[0]);
      }
    );

    fastify.post(
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
        return ResponseTypesController.Post(request.query as Parameters<typeof ResponseTypesController.Post>[0]);
      }
    );

    fastify.put(
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
        return ResponseTypesController.Put(request.query as Parameters<typeof ResponseTypesController.Put>[0]);
      }
    );

    fastify.delete(
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
        return ResponseTypesController.Delete(request.query as Parameters<typeof ResponseTypesController.Delete>[0]);
      }
    );
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
        '/www/kita/node_modules/.pnpm/prettier-plugin-packagejson@2.4.2_prettier@2.8.3/node_modules/prettier-plugin-packagejson/lib/index.js',
        '/www/kita/node_modules/.pnpm/prettier-plugin-jsdoc@0.4.2_prettier@2.8.3/node_modules/prettier-plugin-jsdoc/dist/index.js',
        '/www/kita/node_modules/.pnpm/prettier-plugin-organize-imports@3.2.2_prettier@2.8.3_typescript@4.9.5/node_modules/prettier-plugin-organize-imports/index.js'
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

export * as _name_Controller from './routes/[name]';
export * as AsyncController from './routes/async';
export * as HelloWorldController from './routes/hello-world';
export * as PrimitiveTypesController from './routes/primitive-types';
export * as ResponseTypesController from './routes/response-types';

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
          '/www/kita/node_modules/.pnpm/prettier-plugin-packagejson@2.4.2_prettier@2.8.3/node_modules/prettier-plugin-packagejson/lib/index.js',
          '/www/kita/node_modules/.pnpm/prettier-plugin-jsdoc@0.4.2_prettier@2.8.3/node_modules/prettier-plugin-jsdoc/dist/index.js',
          '/www/kita/node_modules/.pnpm/prettier-plugin-organize-imports@3.2.2_prettier@2.8.3_typescript@4.9.5/node_modules/prettier-plugin-organize-imports/index.js'
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
      controllerMethod: 'put',
      method: 'PUT',
      controllerName: '_name_Controller',
      url: '/:name',
      controllerPath: 'src/routes/[name].ts:16',
      parameters: [
        {
          value: "(request.params as { ['name']: Parameters<typeof _name_Controller.put>[0] })['name']"
        },
        { value: 'request.cookies?.cookie' },
        {
          value: "(request.body as { ['path']: Parameters<typeof _name_Controller.put>[2] }).path"
        },
        {
          value: "(request.body as { ['bodyProp']: Parameters<typeof _name_Controller.put>[3] }).bodyProp"
        },
        {
          value: "(request.query as { ['paramQuery']: Parameters<typeof _name_Controller.put>[4] })['paramQuery']"
        },
        {
          value: "(request.query as { ['typedQuery']: Parameters<typeof _name_Controller.put>[5] })['typedQuery']"
        },
        {
          value:
            "(request.query as { ['typedAndNamedQuery']: Parameters<typeof _name_Controller.put>[6] })['typedAndNamedQuery']"
        },
        { value: 'request' },
        { value: 'reply' },
        {
          value: 'authJwt',
          helper: "const authJwt = await AuthParam.resolver(request, reply, 'jwt');"
        },
        {
          value: 'authBasic',
          helper: "const authBasic = await AuthParam.resolver(request, reply, 'basic');"
        }
      ],
      schema: {
        operationId: 'fullExampleUsingBody',
        response: { default: { type: 'number' } },
        description: 'Route description 1',
        security: [{ default: [] }, { admin: ['read-user', 'write user', '4', '76'] }],
        tags: ['test tag 1'],
        summary: 'route summary 1',
        params: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: ['name']
        },
        body: {
          type: 'object',
          properties: { path: { type: 'number' }, bodyProp: { type: 'number' } },
          required: ['path', 'bodyProp']
        },
        querystring: {
          type: 'object',
          properties: {
            paramQuery: { type: 'string' },
            typedQuery: { type: 'boolean' },
            typedAndNamedQuery: { type: 'boolean' }
          },
          required: ['paramQuery', 'typedQuery', 'typedAndNamedQuery']
        }
      },
      rendered:
        'fastify.put(\n  \'/:name\',\n  {\n    schema: \n      {"operationId":"fullExampleUsingBody","response":{"default":{"type":"number"}},"description":"Route description 1","security":[{"default":[]},{"admin":["read-user","write user","4","76"]}],"tags":["test tag 1"],"summary":"route summary 1","params":{"type":"object","properties":{"name":{"type":"string"}},"required":["name"]},"body":{"type":"object","properties":{"path":{"type":"number"},"bodyProp":{"type":"number"}},"required":["path","bodyProp"]},"querystring":{"type":"object","properties":{"paramQuery":{"type":"string"},"typedQuery":{"type":"boolean"},"typedAndNamedQuery":{"type":"boolean"}},"required":["paramQuery","typedQuery","typedAndNamedQuery"]}}\n    ,\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n        const authJwt = await AuthParam.resolver(request, reply, \'jwt\');\n\n        if (reply.sent) {\n          return;\n        }\n\n        const authBasic = await AuthParam.resolver(request, reply, \'basic\');\n\n        if (reply.sent) {\n          return;\n        }\n\n\n    return _name_Controller.put((request.params as { [\'name\']: Parameters<typeof _name_Controller.put>[0] })[\'name\'],request.cookies?.cookie,(request.body as { [\'path\']: Parameters<typeof _name_Controller.put>[2] }).path,(request.body as { [\'bodyProp\']: Parameters<typeof _name_Controller.put>[3] }).bodyProp,(request.query as { [\'paramQuery\']: Parameters<typeof _name_Controller.put>[4] })[\'paramQuery\'],(request.query as { [\'typedQuery\']: Parameters<typeof _name_Controller.put>[5] })[\'typedQuery\'],(request.query as { [\'typedAndNamedQuery\']: Parameters<typeof _name_Controller.put>[6] })[\'typedAndNamedQuery\'],request,reply,authJwt,authBasic);\n  }\n);',
      operationId: 'fullExampleUsingBody'
    },
    {
      controllerMethod: 'post',
      method: 'POST',
      controllerName: '_name_Controller',
      url: '/:name',
      controllerPath: 'src/routes/[name].ts:43',
      parameters: [
        {
          value: "(request.params as { ['name']: Parameters<typeof _name_Controller.post>[0] })['name']"
        },
        { value: 'request.cookies?.cookie' },
        { value: 'request.body as Parameters<typeof _name_Controller.post>[2]' },
        { value: '(request.query as Parameters<typeof _name_Controller.post>[3])' },
        { value: 'request' },
        { value: 'reply' },
        {
          value: 'authJwt',
          helper: "const authJwt = await AuthParam.resolver(request, reply, 'jwt');"
        },
        {
          value: 'authBasic',
          helper: "const authBasic = await AuthParam.resolver(request, reply, 'basic');"
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
          required: ['name']
        },
        body: { $ref: 'NameQuery' },
        querystring: { $ref: 'NameQuery' }
      },
      rendered:
        'fastify.post(\n  \'/:name\',\n  {\n    schema: \n      {"operationId":"fullExampleExclusiveQuery","response":{"default":{"type":"number"}},"description":"route description 2","security":[{"default":[]},{"admin":["read-user","write user","4","76"]}],"tags":["test tag 2"],"summary":"route summary 2","params":{"type":"object","properties":{"name":{"type":"string"}},"required":["name"]},"body":{"$ref":"NameQuery"},"querystring":{"$ref":"NameQuery"}}\n    ,\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n        const authJwt = await AuthParam.resolver(request, reply, \'jwt\');\n\n        if (reply.sent) {\n          return;\n        }\n\n        const authBasic = await AuthParam.resolver(request, reply, \'basic\');\n\n        if (reply.sent) {\n          return;\n        }\n\n\n    return _name_Controller.post((request.params as { [\'name\']: Parameters<typeof _name_Controller.post>[0] })[\'name\'],request.cookies?.cookie,request.body as Parameters<typeof _name_Controller.post>[2],(request.query as Parameters<typeof _name_Controller.post>[3]),request,reply,authJwt,authBasic);\n  }\n);',
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
        'fastify.get(\n  \'/async\',\n  {\n    schema: \n      {"operationId":"asyncTest","response":{"default":{"type":"null"}}}\n    ,\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return options.piscina.run([], { name: \'asyncTest\' });\n  }\n);',
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
        'fastify.post(\n  \'/async\',\n  {\n    schema: \n      {"operationId":"syncTest","response":{"default":{"type":"null"}}}\n    ,\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return AsyncController.post();\n  }\n);',
      operationId: 'syncTest'
    },
    {
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'HelloWorldController',
      url: '/hello-world',
      controllerPath: 'src/routes/hello-world.ts:4',
      parameters: [
        {
          value: "(request.query as { ['name']?: Parameters<typeof HelloWorldController.get>[0] })['name']"
        }
      ],
      schema: {
        operationId: 'HelloWorldControllerGet',
        response: { default: { type: 'string' } },
        description: 'Hello world rest API endpoint.',
        querystring: {
          type: 'object',
          properties: { name: { type: 'string' } },
          required: []
        }
      },
      rendered:
        'fastify.get(\n  \'/hello-world\',\n  {\n    schema: \n      {"operationId":"HelloWorldControllerGet","response":{"default":{"type":"string"}},"description":"Hello world rest API endpoint.","querystring":{"type":"object","properties":{"name":{"type":"string"}},"required":[]}}\n    ,\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return HelloWorldController.get((request.query as { [\'name\']?: Parameters<typeof HelloWorldController.get>[0] })[\'name\']);\n  }\n);'
    },
    {
      controllerMethod: 'post',
      method: 'POST',
      controllerName: 'PrimitiveTypesController',
      url: '/primitive-types',
      controllerPath: 'src/routes/primitive-types.ts:4',
      parameters: [
        { value: 'request.body as Parameters<typeof PrimitiveTypesController.post>[0]' },
        {
          value: "(request.query as { ['param']: Parameters<typeof PrimitiveTypesController.post>[1] })['param']"
        },
        {
          value: "(request.query as { ['parm2']: Parameters<typeof PrimitiveTypesController.post>[2] })['parm2']"
        }
      ],
      schema: {
        operationId: 'PrimitiveTypesControllerPost',
        response: { default: { type: 'boolean' } },
        description: 'primitive complex queries',
        body: { type: 'array', items: { type: ['string', 'number'] } },
        querystring: {
          type: 'object',
          properties: {
            param: { anyOf: [{ type: 'string' }, { not: {} }] },
            parm2: { type: ['boolean', 'number', 'null'] }
          },
          required: ['param', 'parm2']
        }
      },
      rendered:
        'fastify.post(\n  \'/primitive-types\',\n  {\n    schema: \n      {"operationId":"PrimitiveTypesControllerPost","response":{"default":{"type":"boolean"}},"description":"primitive complex queries","body":{"type":"array","items":{"type":["string","number"]}},"querystring":{"type":"object","properties":{"param":{"anyOf":[{"type":"string"},{"not":{}}]},"parm2":{"type":["boolean","number","null"]}},"required":["param","parm2"]}}\n    ,\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return PrimitiveTypesController.post(request.body as Parameters<typeof PrimitiveTypesController.post>[0],(request.query as { [\'param\']: Parameters<typeof PrimitiveTypesController.post>[1] })[\'param\'],(request.query as { [\'parm2\']: Parameters<typeof PrimitiveTypesController.post>[2] })[\'parm2\']);\n  }\n);'
    },
    {
      controllerMethod: 'get',
      method: 'GET',
      controllerName: 'PrimitiveTypesController',
      url: '/primitive-types',
      controllerPath: 'src/routes/primitive-types.ts:13',
      parameters: [{ value: '(request.query as Parameters<typeof PrimitiveTypesController.get>[0])' }],
      schema: {
        operationId: 'PrimitiveTypesControllerGet',
        response: { default: { type: 'boolean' } },
        description: 'extended queries',
        querystring: { $ref: 'def-structure--294-308--287-309--285-309--239-329--0-330' }
      },
      rendered:
        'fastify.get(\n  \'/primitive-types\',\n  {\n    schema: \n      {"operationId":"PrimitiveTypesControllerGet","response":{"default":{"type":"boolean"}},"description":"extended queries","querystring":{"$ref":"def-structure--294-308--287-309--285-309--239-329--0-330"}}\n    ,\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return PrimitiveTypesController.get((request.query as Parameters<typeof PrimitiveTypesController.get>[0]));\n  }\n);'
    },
    {
      controllerMethod: 'Get',
      method: 'GET',
      controllerName: 'ResponseTypesController',
      url: '/response-types',
      controllerPath: 'src/routes/response-types.ts:6',
      parameters: [{ value: '(request.query as Parameters<typeof ResponseTypesController.Get>[0])' }],
      schema: {
        operationId: 'withTypedPromiseResponse',
        response: { default: { $ref: 'ResponseTypesControllerGetResponse' } },
        tags: ['Response Test'],
        querystring: { $ref: 'HelloWorldQuery' }
      },
      rendered:
        'fastify.get(\n  \'/response-types\',\n  {\n    schema: \n      {"operationId":"withTypedPromiseResponse","response":{"default":{"$ref":"ResponseTypesControllerGetResponse"}},"tags":["Response Test"],"querystring":{"$ref":"HelloWorldQuery"}}\n    ,\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return ResponseTypesController.Get((request.query as Parameters<typeof ResponseTypesController.Get>[0]));\n  }\n);',
      operationId: 'withTypedPromiseResponse'
    },
    {
      controllerMethod: 'Post',
      method: 'POST',
      controllerName: 'ResponseTypesController',
      url: '/response-types',
      controllerPath: 'src/routes/response-types.ts:16',
      parameters: [{ value: '(request.query as Parameters<typeof ResponseTypesController.Post>[0])' }],
      schema: {
        operationId: 'withInferredResponse',
        response: { default: { $ref: 'ResponseTypesControllerPostResponse' } },
        tags: ['Response Test'],
        querystring: { $ref: 'HelloWorldQuery' }
      },
      rendered:
        'fastify.post(\n  \'/response-types\',\n  {\n    schema: \n      {"operationId":"withInferredResponse","response":{"default":{"$ref":"ResponseTypesControllerPostResponse"}},"tags":["Response Test"],"querystring":{"$ref":"HelloWorldQuery"}}\n    ,\n    preHandler: ResponseTypesController.preHandler\n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return ResponseTypesController.Post((request.query as Parameters<typeof ResponseTypesController.Post>[0]));\n  }\n);',
      operationId: 'withInferredResponse',
      options: 'preHandler: ResponseTypesController.preHandler'
    },
    {
      controllerMethod: 'Put',
      method: 'PUT',
      controllerName: 'ResponseTypesController',
      url: '/response-types',
      controllerPath: 'src/routes/response-types.ts:28',
      parameters: [{ value: '(request.query as Parameters<typeof ResponseTypesController.Put>[0])' }],
      schema: {
        operationId: 'withPromiseTypeAlias',
        response: { default: { $ref: 'PR' } },
        tags: ['Response Test'],
        querystring: { $ref: 'HelloWorldQuery' }
      },
      rendered:
        'fastify.put(\n  \'/response-types\',\n  {\n    schema: \n      {"operationId":"withPromiseTypeAlias","response":{"default":{"$ref":"PR"}},"tags":["Response Test"],"querystring":{"$ref":"HelloWorldQuery"}}\n    ,\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return ResponseTypesController.Put((request.query as Parameters<typeof ResponseTypesController.Put>[0]));\n  }\n);',
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
        'fastify.delete(\n  \'/response-types\',\n  {\n    schema: \n      {"operationId":"withTypeAliasPromise","response":{"default":{"$ref":"DR"}},"tags":["Response Test"],"querystring":{"$ref":"HelloWorldQuery"}}\n    ,\n    \n  },\n  //@ts-ignore - we may have unused params\n  async (request, reply) => {\n\n    return ResponseTypesController.Delete((request.query as Parameters<typeof ResponseTypesController.Delete>[0]));\n  }\n);',
      operationId: 'withTypeAliasPromise'
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
      $id: 'def-structure--294-308--287-309--285-309--239-329--0-330',
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
    "import * as AuthParam from './helpers/auth-param';",
    "import * as HelloWorldController from './routes/hello-world';",
    "import * as PrimitiveTypesController from './routes/primitive-types';",
    "import * as ResponseTypesController from './routes/response-types';",
    "import * as _name_Controller from './routes/[name]';"
  ],
  controllers: [
    "export * as _name_Controller from './routes/[name]';",
    "export * as AsyncController from './routes/async';",
    "export * as HelloWorldController from './routes/hello-world';",
    "export * as PrimitiveTypesController from './routes/primitive-types';",
    "export * as ResponseTypesController from './routes/response-types';"
  ],
  hasAsync: true
};
