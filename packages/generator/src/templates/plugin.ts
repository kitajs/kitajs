import {
  JsonSchema,
  KitaPlugin,
  Provider,
  Route,
  kFastifyVariable,
  kKitaOptions,
  kSchemaDefinitions,
  stringifyOptions
} from '@kitajs/common';
import stringify from 'json-stable-stringify';
import { ts } from 'ts-writer';
import { toMaybeRelativeImport } from '../util/path';

export function generatePlugin(
  routes: Route[],
  schemas: JsonSchema[],
  plugins: KitaPlugin[],
  providers: Provider[],
  cwdSrcRelativity: string
) {
  return ts`${'plugin'}
    'use strict';

    const fp = require('fastify-plugin');

    /**
     * The Kita generated fastify plugin. Registering it into your fastify instance will
     * automatically register all routes, schemas and providers.
     *
     * @example
     * \`\`\`ts
     * import { Kita } from '@kitajs/runtime';
     * 
     * const app = fastify();
     * 
     * app.register(Kita)
     * 
     * app.listen().then(console.log);
     * \`\`\`
     * 
     * @see {@link https://kita.js.org}
     */
    exports.Kita = fp(
      async (${kFastifyVariable}, ${kKitaOptions}) => {
        // Register all plugins
${plugins.map(toPlugin)}

        // Import all routes
${routes.map(toRoute)}

        // Import all providers with application hooks
${providers.filter((p) => p.applicationHooks.length).map((p) => toProvider(p, cwdSrcRelativity))}

        // Add all schemas
${schemas.map(toSchema)}

        // Register all routes - inside a plugin to make sure capsulation works
        // https://github.com/fastify/fastify-plugin/issues/78#issuecomment-672692334
        await ${kFastifyVariable}.register(async ${kFastifyVariable} => {
${providers.flatMap((p) => p.applicationHooks.map((h) => `${kFastifyVariable}.addHook('${h}', ${p.type}.${h});`))}

${routes.map((r) => `${kFastifyVariable}.route(${r.schema.operationId}.${r.schema.operationId}Options)`)}
        }, ${kKitaOptions});
      },
      {
        name: 'Kita',
        fastify: '4.x'
      }
    );

    ${getSchemaDefinitions(schemas) && `module.exports.${kSchemaDefinitions} = ${toSchemaDefinitions(schemas)}`}

    exports.__esModule = true;

    ${ts.types}

    import type { FastifyPluginAsync } from 'fastify'

    export declare const Kita: FastifyPluginAsync<{${plugins.map(toPluginType).join(',\n')}}>;
    
    ${
      getSchemaDefinitions(schemas) &&
      `
/**
 * All schemas exported in the \`providers/schemas.ts\` file
 */
export declare const ${kSchemaDefinitions}: ${toSchemaDefinitions(schemas)}
   `
    }
  `;
}

function toRoute(route: Route) {
  return `const ${route.schema.operationId} = require('./routes/${route.schema.operationId}');`;
}

function toProvider(provider: Provider, cwdSrcRelativity: string) {
  return `const ${provider.type} = require(${toMaybeRelativeImport(provider.providerPath, cwdSrcRelativity)});`;
}

function getSchemaDefinitions(schemas: JsonSchema[]) {
  return schemas.find((schema) => schema.$id === kSchemaDefinitions);
}

function toSchemaDefinitions(schemas: JsonSchema[]) {
  const kitaSchema = getSchemaDefinitions(schemas);

  if (!kitaSchema) {
    return '{}';
  }

  return stringify(
    {
      ...kitaSchema,
      // Remove the $id to make it more readable without messing up the schema
      $id: undefined
    },
    { space: 4 }
  );
}

function toPlugin(plugin: KitaPlugin) {
  return `
   if (${kKitaOptions}.${plugin.name} !== false) {
     await ${kFastifyVariable}.register(require("${plugin.importUrl}"), Object.assign(${stringifyOptions(
       plugin.options
     )}, ${kKitaOptions}.${plugin.name} || {}))
   }
  `;
}

function toSchema(schema: JsonSchema) {
  return `${kFastifyVariable}.addSchema(${stringify(schema, { space: 4 })})`;
}

function toPluginType(plugin: KitaPlugin) {
  return `
    /**
     * Options for the \`${plugin.name}\` plugin. Use \`false\` to disable it manually.
     * 
     * @default ${stringifyOptions(plugin.options)}
     * @see {@link ${plugin.importUrl}}
     */
    ${plugin.name}?: Parameters<typeof import("${plugin.importUrl}").default>[1] | false`;
}
