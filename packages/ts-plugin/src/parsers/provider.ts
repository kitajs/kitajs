import { KitaError, ProviderResolverNotFound, UnknownNodeError } from '@kitajs/common';
import type { KitaParser } from '@kitajs/parser';
import type ts from 'typescript';

/** Manual and faster parsing of a single provider file. */
export function appendProviderDiagnostics(parser: KitaParser, provider: ts.SourceFile, diagnostics: ts.Diagnostic[]) {
  const supports = parser.rootProviderParser.supports(provider);

  // This should never happens as there is a catch-all in the parser
  if (!supports) {
    diagnostics.push(new ProviderResolverNotFound(provider).diagnostic);
    return;
  }

  try {
    // Simply tries to parse the provider

    parser.rootProviderParser.parse(provider);
  } catch (error) {
    if (error instanceof KitaError) {
      diagnostics.push(error.diagnostic);
    } else if (error instanceof Error) {
      diagnostics.push(new UnknownNodeError(provider, error.message).diagnostic);
    } else {
      diagnostics.push(new UnknownNodeError(provider, String(error)).diagnostic);
    }
  }
}
