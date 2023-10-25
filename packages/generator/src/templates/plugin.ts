import { JsonSchema, KitaPlugin, Route, kFastifyVariable, kKitaOptions, stringifyOptions } from '@kitajs/common';
import { EOL } from 'os';

export const plugin = (routes: Route[], schemas: JsonSchema[], plugins: KitaPlugin[]) =>
  /* ts */ `

import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify'

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
 * @see {@link https://kita.js.org/}
 */
export const Kita: FastifyPluginAsync<${pluginType(plugins)}> = fp<${pluginType(plugins)}>(
  async (${kFastifyVariable}, ${kKitaOptions}) => {
    // Register all plugins
    ${plugins.map(kitaPlugin).join(EOL)}

    // Import all routes
    ${routes.map((r) => `const ${r.schema.operationId} = await import('./routes/${r.schema.operationId}');`).join(EOL)}

    // Add all schemas
    ${schemas.map(schema).join(EOL)}

    // Register all routes - inside a plugin to make sure capsulation works
    // https://github.com/fastify/fastify-plugin/issues/78#issuecomment-672692334
    await ${kFastifyVariable}.register(async ${kFastifyVariable} => {
      ${routes
        .map((r) => `${kFastifyVariable}.route(${r.schema.operationId}.${r.schema.operationId}Options)`)
        .join(EOL)}
    }, ${kKitaOptions});
  },
  {
    name: 'Kita',
    fastify: '4.x'
  }
);

`.trim();

const schema = (s: JsonSchema) =>
  /* ts */ `

${kFastifyVariable}.addSchema(${JSON.stringify(s, null, 2)});

`.trim();

const pluginType = (plugins: KitaPlugin[]) =>
  /* ts */ `

{
  ${plugins
    .map((p) =>
      `
  
  /**
   * Options for the ${p.name} plugin. Use false to disable it manually.
   * 
   * Defaults to:
   * 
   * \`\`\`ts
   * ${stringifyOptions(p.options)}
   * \`\`\`
   *
   * @see {@link ${p.importUrl}}
   */
  ${p.name}?: Parameters<typeof import("${p.importUrl}").default>[1] | false
  
  `.trim()
    )
    .join(`,${EOL}`)}
}

`.trim();

const kitaPlugin = (plugin: KitaPlugin) =>
  /* ts */ `

if (${kKitaOptions}.${plugin.name} !== false) {
  await ${kFastifyVariable}.register(await import("${plugin.importUrl}"), Object.assign(${stringifyOptions(
    plugin.options
  )}, ${kKitaOptions}.${plugin.name} || {}))
}

`.trim();
