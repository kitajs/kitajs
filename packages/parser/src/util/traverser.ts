import {
  Parameter,
  ParameterParser,
  ParameterResolverNotFoundError,
  Parser,
  Route,
  SourceFileNotFoundError,
  UnknownKitaError,
  isPromiseLike
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
      let supports = parser.supports(statement);

      if (isPromiseLike(supports)) {
        supports = await supports;
      }

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

    let supports = parser.supports(sourceFile);

    if (isPromiseLike(supports)) {
      supports = await supports;
    }

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
  let parameterIndex = 0;

  for (let index = 0; index < fn.parameters.length; index++) {
    const parameter = fn.parameters[index]!;
    let supports = parser.supports(parameter);

    if (isPromiseLike(supports)) {
      supports = await supports;
    }

    // All parameters should be supported by at least one parser
    if (!supports) {
      throw new ParameterResolverNotFoundError(toPrettySource(parameter));
    }

    // Yield the result of the parser (promises are unwrapped)
    let param = parser.parse(parameter, route, fn, index) as Parameter;

    if (param instanceof Promise) {
      param = await param;
    }

    // Ignored parameter
    if (param.ignore) {
      continue;
    }

    yield { param, index: parameterIndex++ };
  }
}
