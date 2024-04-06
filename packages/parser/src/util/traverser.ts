import {
  EmptyRouteFileError,
  KitaError,
  type Parameter,
  type ParameterParser,
  ParameterResolverNotFoundError,
  type Parser,
  type Route,
  RouteParameterMultipleErrors,
  SourceFileNotFoundError,
  UnknownKitaError,
  isPromiseLike
} from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';

/** Traverse each statement of a source file for the given path and yields the result of the provided parser or an error. */
export async function* traverseStatements<R>(
  program: Pick<ts.Program, 'getSourceFile'>,
  parser: Parser<ts.Statement, R, []>,
  files: string[]
) {
  for (const file of files) {
    const sourceFile = program.getSourceFile(file);

    if (!sourceFile) {
      yield new SourceFileNotFoundError(file);
      return;
    }

    let parsed = 0;

    for (const statement of sourceFile.statements) {
      let supports = parser.supports(statement);

      if (isPromiseLike(supports)) {
        supports = await supports;
      }

      if (supports) {
        parsed++;

        try {
          let parsed = parser.parse(statement);

          if (isPromiseLike(parsed)) {
            parsed = await parsed;
          }

          yield { parsed, statement };
        } catch (error) {
          // Also returns errors as values to be handled by the caller
          // This allows us to keep parsing even if some routes fail
          if (error instanceof Error) {
            yield error;
          } else {
            yield new UnknownKitaError(String(error), error);
          }
        }
      }
    }

    if (parsed === 0) {
      yield new EmptyRouteFileError(sourceFile);
    }
  }
}

/** Traverse each source file for the given path and yields the result of the provided parser or an error. */
export async function* traverseProviders<R>(
  program: Pick<ts.Program, 'getSourceFile'>,
  parser: Parser<ts.SourceFile, R, []>,
  files: string[]
) {
  files = files.slice();
  const errors = [];

  while (files.length) {
    const initialLength = files.length;

    for (let i = 0; i < initialLength; i++) {
      const filename = files.shift()!;
      const source = program.getSourceFile(filename);

      if (!source) {
        throw new SourceFileNotFoundError(filename);
      }

      let supports = parser.supports(source);

      if (isPromiseLike(supports)) {
        supports = await supports;
      }

      if (supports) {
        try {
          let parsed = parser.parse(source);

          if (isPromiseLike(parsed)) {
            parsed = await parsed;
          }

          yield parsed;
        } catch (error) {
          if (
            // If a parameter resolver is not found, it may be a provider
            // that would be parsed by the next parser in the chain
            error instanceof ParameterResolverNotFoundError
          ) {
            errors.push(error);
            files.push(filename);
            continue;
          }

          // Also returns errors as values to be handled by the caller
          // This allows us to keep parsing even if some routes fail
          if (error instanceof Error) {
            yield error;
          } else {
            yield new UnknownKitaError(String(error), error);
          }
        }
      }
    }

    // All files could be parsed
    if (files.length === 0) {
      break;
    }

    // If the file length is the same, there is no point in trying again
    if (files.length === initialLength) {
      yield* errors;
      break;
    }

    files = files.reverse();
  }
}

/**
 * Traverse each parameter for the given function and yields the result of the provided parser. Errors are thrown
 * synchronously.
 */
export async function* traverseParameters(fn: ts.FunctionDeclaration, parser: ParameterParser, route: Route | null) {
  let parameterIndex = 0;

  const errors: KitaError[] = [];

  for (let index = 0; index < fn.parameters.length; index++) {
    try {
      const parameter = fn.parameters[index]!;
      let supports = parser.supports(parameter);

      if (isPromiseLike(supports)) {
        supports = await supports;
      }

      // All parameters should be supported by at least one parser
      if (!supports) {
        throw new ParameterResolverNotFoundError(parameter.type || parameter);
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
    } catch (error) {
      if (error instanceof KitaError) {
        errors.push(error);
      } else {
        errors.push(new UnknownKitaError(String(error), error));
      }
    }
  }

  if (errors.length > 1) {
    throw new RouteParameterMultipleErrors(fn.name || fn, errors);
  }
  if (errors.length) {
    throw errors[0];
  }
}
