import { kSchemaDefinitions, type JsonSchema, type KitaPlugin, type Provider, type Route } from '@kitajs/common';
import stringify from 'json-stable-stringify';
import { formatImport } from '../util/path';
import { tst } from '../util/template';
import { createPlugin } from './plugin';
import { createRoute, createRouteType } from './route';

export const generateKitaRuntime = (
  routes: Route[],
  plugins: KitaPlugin[],
  providers: Provider[],
  schemas: JsonSchema[],
  src: string
) => tst/* ts */ `
  //@ts-nocheck - This is a generated file, type errors may occur
  // This file is generated by Kita. Modifications will be overwritten.
  //
  // YOU SHOULD add this file to your .gitignore, .prettierignore, .eslintignore 
  // and/or any other linter/formatter/tool you may use.
  // 
  // You should also ignore this file from your version control system and prefer
  // to run \`kita build\` every time you need to run/test your application.
  // 
  // Learn more at https://kita.js.org

  import fp from 'fastify-plugin'
  import type { FastifyRequest, FastifyReply } from 'fastify'
  ${plugins.map(toPluginImport)}
  ${providers.map((p) => toProviderImport(p, src))}${toAllMethod(routes)}
  ${groupRouteImports(routes, src)}
  ${groupRouteExports(routes, src)}
  ${routes.map(createRouteType)}
  ${routes.map(createRoute)}
  ${createPlugin(routes, plugins, providers, schemas)}
  ${createSchemaDefinitions(schemas)}
`;

export const toAllMethod = (routes: Route[]) =>
  routes.find((r) => r.method === 'ALL') ? `\nimport { supportedMethods } from 'fastify/lib/httpMethods.js'` : '';

export const toProviderImport = (provider: Provider, src: string) => tst/* ts */ `
  import * as ${provider.type} from '${formatImport(provider.providerPath, src)}'
`;

export const toPluginImport = (plugin: KitaPlugin) => tst/* ts */ `
  import ${plugin.name} from '${plugin.importUrl}'
`;

export const toSchemaDefinitions = (schema: JsonSchema) => tst/* ts */ `
  export const ${kSchemaDefinitions} = ${stringify(
    // Remove the $id to make it more readable without messing up the schema
    { ...schema, $id: undefined },
    { space: 4 }
  )}
`;

export const toRouteImport = (r: Route, src: string) => tst/* ts */ `
  import * as ${r.controllerName} from '${formatImport(r.relativePath, src)}'
`;

export const toRouteExport = ([path, names]: [path: string, names: string[]], src: string) => tst/* ts */ `
  export { ${names.join(', ')} } from '${formatImport(path, src)}'
`;

// HELPERS

export function groupRouteImports(routes: Route[], src: string) {
  return routes
    .filter((v, i, a) => a.findIndex((t) => t.relativePath === v.relativePath) === i)
    .map((f) => toRouteImport(f, src));
}

export function groupRouteExports(routes: Route[], src: string) {
  const imports: Record<string, string[]> = {};

  for (const route of routes) {
    // biome-ignore lint/suspicious/noAssignInExpressions: easier syntax
    const path = (imports[route.relativePath] ??= []);

    path.push(`${route.controllerMethod} as ${route.schema.operationId}`);
  }

  return Object.entries(imports).map((f) => toRouteExport(f, src));
}

export function createSchemaDefinitions(schemas: JsonSchema[]) {
  const schema = schemas.find((schema) => schema.$id === kSchemaDefinitions);
  return schema && toSchemaDefinitions(schema);
}
