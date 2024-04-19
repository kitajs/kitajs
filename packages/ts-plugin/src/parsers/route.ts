import { KitaError, ProviderResolverNotFound, SourceFileNotFoundError, UnknownNodeError } from '@kitajs/common';
import type { KitaParser } from '@kitajs/parser';
import type ts from 'typescript';

/**
 * Sync parses a single route file and appends any errors to the diagnostics array.
 *
 * This is not the best optimized way, was we use {@linkcode awaitSync} to remove promises as ts server does not support
 * async diagnostics and we need to parse all providers before to avoid unknown parameter errors when a provider is
 * being used.
 */
export function appendRouteDiagnostics(
  parser: KitaParser,
  program: ts.Program,
  route: ts.SourceFile,
  diagnostics: ts.Diagnostic[],
  providerPaths: string[]
) {
  // Sync parses all provider paths
  for (const file of providerPaths) {
    const provider = program.getSourceFile(file);

    if (!provider) {
      diagnostics.push(new SourceFileNotFoundError(file).diagnostic);
      continue;
    }

    const supports = parser.rootProviderParser.supports(provider);

    // This should never happens as there is a catch-all in the parser
    if (!supports) {
      diagnostics.push(new ProviderResolverNotFound(provider).diagnostic);
      return;
    }

    try {
      const parsed = parser.rootProviderParser.parse(provider);

      // @ts-expect-error - Manually push the provider to the parser providers array
      parser.providers.set(parsed.type, parsed);
    } catch {
      // We are not checking for provider errors here. So its safe to silently fail
      // In case a used provider fails, it will also fail in in this parameter parser.
      // But there's nothing we can do (for now.)
    }
  }

  // After registering all providers, we can now parse the route
  for (const statement of route.statements) {
    const supports = parser.rootRouteParser.supports(statement);

    // Ignore this statement
    if (!supports) {
      continue;
    }

    try {
      // Simply tries to parse the route
      parser.rootRouteParser.parse(statement);
    } catch (error) {
      if (error instanceof KitaError) {
        diagnostics.push(error.diagnostic);
      } else if (error instanceof Error) {
        diagnostics.push(new UnknownNodeError(statement, error.message).diagnostic);
      } else {
        diagnostics.push(new UnknownNodeError(statement, String(error)).diagnostic);
      }
    }
  }
}
