import {
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

export const runtime:KitaGeneratedRuntime<{
  ${plugins.map(toPluginType)}
}> = {
    schemas: [
      ${schemas.map(toSchema)}
    ],
    routes: [
      ${routes.map((r) => toOptions(r, providers))}
    ],
    applicationHooks: [
      ${providers.map(toProviderApplicationHooks)}
    ],
    plugins: {
      ${plugins.map(createPluginRegister)}
    }
  }
`;

const toSchema = (schema: JsonSchema) => tst/* ts */ `
  ${stringify(schema)},
`;

const createPluginRegister = (plugin: KitaPlugin) => tst/* ts */ `
  ${plugin.name}: [${plugin.name}, ${stringifyOptions(plugin.options)}],
`;

const toProviderApplicationHooks = (provider: Provider) => tst/* ts */ `
  ${provider.applicationHooks.map((h) => toAddApplicationHooks(h, provider.type))}
`;

const toAddApplicationHooks = (applicationHook: string, controllerName: string) => tst/* ts */ `
  ['${applicationHook}', ${controllerName}.${applicationHook}],
`;

const toOptions = (r: Route, providers: Provider[]) => {
  const code = tst/* ts */ `
    {
      url: '${r.url}',
      method: ${r.method === 'ALL' ? 'supportedMethods' : `'${r.method}'`},
      handler: ${r.schema.operationId}Handler,
      schema: ${toReplacedSchema(r)}, ${toLifecycleArray(r.parameters, providers)}
    },`;

  return r.options ? r.options.replace('$1', code) : code;
};

export function toReplacedSchema(r: Route) {
  let code = stringify(r.schema);

  for (const param of r.parameters) {
    if (param.schemaTransformer) {
      code = tst/* ts */ `${param.providerName}.transformSchema(${code}${
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

  const code = Object.entries(hookTypes)
    .map(([hook, values]) => tst/* ts */ `${hook}: [${values.map((v) => `${v}.${hook}`).join(', ')}]`)
    .join(',');

  if (code) {
    return `\n${code}`;
  }

  return '';
}

const toPluginType = (plugin: KitaPlugin) => tst/* ts */ `
  /**
   * Options for the \`${plugin.name}\` plugin.
   *
   * Use \`false\` to disable it manually.
   *
   * @see {@linkcode ${plugin.name}}
   */
  ${plugin.name}?: Parameters<typeof ${plugin.name}>[1] | boolean
`;
