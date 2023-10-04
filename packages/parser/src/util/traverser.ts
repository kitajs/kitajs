import {
  ParameterParser,
  ParameterResolverNotFoundError,
  Parser,
  Route,
  SourceFileNotFoundError,
  UnknownKitaError
} from '@kitajs/common';
import ts from 'typescript';
import { toPrettySource } from './nodes';

/** Traverse each statement of a source file for the given path and yields the result of the provided parser or an error. */
export async function* traverseStatements<R>(
  program: ts.Program,
  parser: Parser<ts.Statement, R, []>,
  files: string[]
) {
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

/** Traverse each source file for the given path and yields the result of the provided parser or an error. */
export async function* traverseSource<R>(program: ts.Program, parser: Parser<ts.SourceFile, R, []>, files: string[]) {
  for (const file of files) {
    const sourceFile = program.getSourceFile(file);

    if (!sourceFile) {
      throw new SourceFileNotFoundError(file);
    }

    const supports = await parser.supports(sourceFile);

    if (supports) {
      yield Promise.resolve(parser.parse(sourceFile))
        // Also returns errors as values to be handled by the caller
        // This allows us to keep parsing even if some routes fail
        .catch((err) => (err instanceof Error ? err : new UnknownKitaError(err)));
    }
  }
}

/**
 * Traverse each parameter for the given function and yields the result of the provided parser. Errors are thrown
 * synchronously.
 */
export async function* traverseParameters(fn: ts.FunctionDeclaration, parser: ParameterParser, route: Route | null) {
  let paramIndex = 0;

  for (let index = 0; index < fn.parameters.length; index++) {
    const parameter = fn.parameters[index]!;
    const supports = await parser.supports(parameter);

    if (!supports) {
      throw new ParameterResolverNotFoundError(toPrettySource(parameter));
    }

    // Yield the result of the parser (promises are unwrapped)
    const param = parser.parse(parameter, route, fn, index);

    // Synthetic parameters should not yield any parameter
    // and should be removed from the list without modifying
    // the index
    if (parser.synthetic) {
      continue;
    } else {
      paramIndex++;
    }

    if (param instanceof Promise) {
      yield param.then((param) => ({ param, index }));
    } else {
      yield { param, index };
    }
  }
}
