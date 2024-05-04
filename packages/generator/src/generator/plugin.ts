import {
  kFastifyVariable,
  kKitaOptions,
  stringifyOptions,
  type JsonSchema,
  type KitaPlugin,
  type Parameter,
  type Provider,
  type Route
} from '@kitajs/common';
import stringify from 'json-stable-stringify';
import { tst } from '../util/template';

export const createPlugin = (
  routes: Route[],
  plugins: KitaPlugin[],
  providers: Provider[],
  schemas: JsonSchema[]
) => tst/* ts */ `
  export interface KitaPluginOptions {
    ${plugins.map(toPluginType)}
  }

  /**
   * The Kita generated fastify plugin. 
   * 
   * Registering it into your fastify instance will automatically register all
   * routes, schemas and providers.
   *
   * @example
   * \`\`\`ts
   * app.register(Kita, {
   *   // You can configure all ${plugins.length} configured plugins here:
   *   ${plugins.map((p) => `${p.name}: { }`).join(',\n *   ')}
   * })
   * \`\`\`
   * 
   * @see {@link https://kita.js.org}
   */
  export const Kita = fp<KitaPluginOptions>(
    async (${kFastifyVariable}, options) => {
      ${plugins.map(createPluginRegister)}
      ${schemas.map(toSchema)}
      ${
        /*

      Register all routes inside a plugin to make sure capsulation works
      https://github.com/fastify/fastify-plugin/issues/78#issuecomment-672692334

      */ ''
      }
      await ${kFastifyVariable}.register(
        async ${kFastifyVariable} => {
          ${providers.map(toProviderApplicationHooks)}
          ${routes.map((r) => toRouteRegister(r, providers))}
        },
        ${kKitaOptions}
      )
    }, 
    {
      name: '@kitajs/runtime',
      fastify: '4.x'
    }
  )
`;

const toPluginType = (plugin: KitaPlugin) => tst/* ts */ `
  /**
  * Options for the \`${plugin.name}\` plugin. 
  * 
  * Use \`false\` to disable it manually.
  * 
  * @see {@linkcode ${plugin.name}}
  */
  ${plugin.name}?: Parameters<typeof ${plugin.name}>[1] | false
`;

const toSchema = (schema: JsonSchema) => tst/* ts */ `
  ${kFastifyVariable}.addSchema(${stringify(schema, { space: 4 })})
`;

const createPluginRegister = (plugin: KitaPlugin) => tst/* ts */ `
  const ${plugin.name}Display = 
  //@ts-ignore - fastify-plugin does this
  ${plugin.name}[Symbol.for('fastify.display-name')]

  if (
      ${plugin.name}Display &&
      !${kFastifyVariable}.hasPlugin(${plugin.name}Display) &&
      ${kKitaOptions}.${plugin.name} !== false
    ) {
    await ${kFastifyVariable}.register( 
      ${plugin.name}, 
      Object.assign(${stringifyOptions(plugin.options)}, ${kKitaOptions}.${plugin.name} || {}) as any
    )
  }
`;

const toProviderApplicationHooks = (provider: Provider) => tst/* ts */ `
  ${provider.applicationHooks.map((h) => toAddApplicationHooks(h, provider.type))}
`;

const toAddApplicationHooks = (applicationHook: string, controllerName: string) => tst/* ts */ `
  ${kFastifyVariable}.addHook('${applicationHook}', ${controllerName}.${applicationHook})
`;

const toRouteRegister = (route: Route, providers: Provider[]) => tst/* ts */ `
  ${kFastifyVariable}.route(${toOptions(route, providers)})
`;

const toOptions = (r: Route, providers: Provider[]) => {
  const code = tst/* ts */ `
    {
      url: '${r.url}',
      method: ${r.method === 'ALL' ? 'supportedMethods' : `'${r.method}'`},
      handler: ${r.schema.operationId}Handler,
      schema: ${toReplacedSchema(r)},
      ${toLifecycleArray(r.parameters, providers)}
    }
  `;

  return r.options ? r.options.replace('$1', code) : code;
};

export function toReplacedSchema(r: Route) {
  let code = stringify(r.schema, { space: 4 });

  for (const param of r.parameters) {
    if (param.schemaTransformer) {
      code = `${param.providerName}.transformSchema(${code}${
        Array.isArray(param.schemaTransformer) ? `, ${param.schemaTransformer.join(', ')}` : ''
      })`;
    }
  }

  return code;
}

export function toLifecycleArray(parameters: Parameter[], providers: Provider[]) {
  const hookTypes: Record<string, string[]> = {};

  for (const parameter of parameters) {
    if (!parameter.providerName) {
      continue;
    }

    const provider = providers.find((p) => p.type === parameter.providerName)!;

    for (const hook of provider.lifecycleHooks) {
      hookTypes[hook] ??= [];

      hookTypes[hook]!.push(parameter.providerName!);
    }
  }

  return Object.entries(hookTypes)
    .map(([hook, values]) => `${hook}: [${values.map((v) => `${v}.${hook}`).join(', ')}]`)
    .join(',');
}
