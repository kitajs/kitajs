import minimatch from 'minimatch';
import { KitaError } from './errors';
import type { KitaGenerator } from './generator';
import { NodeResolver } from './node-resolvers/base';

export async function generateAst(kita: KitaGenerator) {
  // Adds custom parameter resolver imports
  for (const [name, filepath] of Object.entries(kita.config.params)) {
    kita.ast.addImport(`import ${name} from '${kita.importablePath(filepath)}';`);
  }

  // Populate data with controllers and routes info.
  const routeSources = kita.program.getSourceFiles().filter(
    (s) =>
      // Not a declaration file
      !s.isDeclarationFile &&
      // Not a controller file
      kita.config.controllers.glob.some((glob) => minimatch(s.fileName, glob))
  );

  // Resolve all sources into multiple routes routes
  for await (const routes of routeSources.map((source) =>
    NodeResolver.resolveSource(source, kita)
  )) {
    // For each
    for await (const route of routes) {
      if (!route) {
        continue;
      }

      route.template = await kita.loadRenderer(route.templatePath).then((r) => r(route));

      if (route.operationId) {
        // Searches for different route operationIds
        const search = kita.ast.routes.find((r) => r.operationId === route.operationId);

        if (search) {
          throw KitaError(`Duplicate operationId \`${route.operationId}\``, [
            search.controllerPath,
            route.controllerPath
          ]);
        }
      }

      kita.ast.routes.push(route);
    }
  }

  // Include all generated definitions into the output file.
  kita.schemaStorage.applyDefinitions(kita.ast);

  return kita.ast;
}
