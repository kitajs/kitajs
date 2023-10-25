import {
  EmptyRouteFileError,
  KitaError,
  Parameter,
  ParameterParser,
  ParameterResolverNotFoundError,
  Parser,
  Route,
  RouteParameterMultipleErrors,
  SourceFileNotFoundError,
  UnknownKitaError,
  isPromiseLike
} from '@kitajs/common';
import { ts } from 'ts-json-schema-generator';

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

          yield parsed;
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
export async function* traverseSource<R>(
  program: Pick<ts.Program, 'getSourceFile'>,
  parser: Parser<ts.SourceFile, R, []>,
  files: string[]
) {
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
      try {
        let parsed = parser.parse(sourceFile);

        if (isPromiseLike(parsed)) {
          parsed = await parsed;
        }

        yield parsed;
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
}

/**
 * Traverse each parameter for the given function and yields the result of the provided parser. Errors are thrown
 * synchronously.
 */
export async function* traverseParameters(fn: ts.FunctionDeclaration, parser: ParameterParser, route: Route | null) {
  let parameterIndex = 0;

  let errors: KitaError[] = [];

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

  if (errors.length) {
    if (errors.length === 1) {
      throw errors[0];
    } else {
      throw new RouteParameterMultipleErrors(fn.name || fn, errors);
    }
  }
}
