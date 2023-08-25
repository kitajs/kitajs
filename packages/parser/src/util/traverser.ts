import { Parser, SourceFileNotFoundError, UnknownKitaError } from '@kitajs/common';
import ts from 'typescript';

/**
 * Traverse each source file for the given path and yields the result of the provided parser or an error.
 */
export async function* traverseSources<R>(program: ts.Program, parser: Parser<ts.Statement, R, []>, files: string[]) {
  for (const file of files) {
    const sourceFile = program.getSourceFile(file);

    if (!sourceFile) {
      throw new SourceFileNotFoundError(file);
    }

    for (const statement of sourceFile.statements) {
      const supports = await parser.supports(statement);

      if (supports) {
        yield Promise.resolve(parser.parse(statement))
          // Also returns errors as values to be handled by the caller
          // This allows us to keep parsing even if some routes fail
          .catch((err) => (err instanceof Error ? err : new UnknownKitaError(err)));
      }
    }
  }
}
