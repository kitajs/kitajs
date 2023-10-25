import { JsonSchema, Route, kFastifyVariable } from '@kitajs/common';
import { EOL } from 'os';

export const plugin = (routes: Route[], schemas: JsonSchema[]) =>
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
export const Kita: FastifyPluginAsync = fp<{}>(
  async (${kFastifyVariable}) => {
    // Import all routes
    ${routes
      .map((r) => `const ${r.schema.operationId} = await import('./routes/${r.schema.operationId}');`)
      .join(EOL)}  

    // Add all schemas
    ${schemas.map(schema).join(EOL)}

    // Register all routes
    ${routes.map((r) => `fastify.route(${r.schema.operationId}.${r.schema.operationId}Options)`).join(EOL)}
  },
  {
    name: 'Kita',
    fastify: '4.x',
    // Ensure KitaJS does not pollute the global namespace
    encapsulate: true
  }
);

`.trim();

const schema = (s: JsonSchema) =>
  /* ts */ `

${kFastifyVariable}.addSchema(${JSON.stringify(s, null, 2)});

`.trim();
