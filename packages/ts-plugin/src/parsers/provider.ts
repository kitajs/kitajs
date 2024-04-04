import { KitaError, ProviderResolverNotFound, UnknownKitaError, isPromiseLike } from '@kitajs/common';
import { KitaParser } from '@kitajs/parser';
import ts from 'typescript';
import { awaitSync } from '../util/sync';

/** Manual and faster parsing of a single provider file. */
export function appendProviderDiagnostics(parser: KitaParser, provider: ts.SourceFile, diagnostics: ts.Diagnostic[]) {
  let supports = parser.rootProviderParser.supports(provider);

  if (isPromiseLike(supports)) {
    supports = awaitSync(supports);
  }

  // This should never happens as there is a catch-all in the parser
  if (!supports) {
    diagnostics.push(new ProviderResolverNotFound(provider).diagnostic);
    return;
  }

  try {
    let parsed = parser.rootProviderParser.parse(provider);

    if (isPromiseLike(parsed)) {
      parsed = awaitSync(parsed);
    }

    // success!
  } catch (error) {
    if (error instanceof KitaError) {
      diagnostics.push(error.diagnostic);
    } else if (error instanceof Error) {
      diagnostics.push(new UnknownKitaError(String(error), error).diagnostic);
    } else {
      diagnostics.push(new UnknownKitaError('Unknown error!', error).diagnostic);
    }
  }
}
