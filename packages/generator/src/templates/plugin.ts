import { Route } from '@kitajs/common';
import { EOL } from 'os';
import { esmImport } from './import';

export const plugin = (routes: Route[]) =>
  /* ts */ `

import fp from 'fastify-plugin';

import { RouteSchemas } from './schemas';

${routes
  .map((r) => esmImport({ name: `{ ${r.schema.operationId}Options }`, path: `./routes/${r.schema.operationId}` }))
  .join(EOL)}

/**
 * The Kita generated fastify plugin. Registering it into your fastify instance will
 * automatically register all routes, schemas and controllers.
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
 */
export const Kita = fp<{}>(
  async (fastify) => {
    // Register all schemas
    for (const schema of RouteSchemas) {
      fastify.addSchema(schema);
    }

    // Register all routes
    ${routes.map((r) => `fastify.route(${r.schema.operationId}Options)`).join(EOL)}
  },
  {
    name: 'Kita',
    fastify: '4.x',
    // Ensure KitaJS does not pollute the global namespace
    encapsulate: true
  }
);

`.trim();
