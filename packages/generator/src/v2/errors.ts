import type ts from 'typescript';

/**
 * A KitaError instance is thrown when something goes wrong during the
 * parsing, resolving or generation process.
 *
 * All errors that you can expect to be thrown by Kita are subclasses of this
 * class.
 */
export abstract class KitaError extends Error {
  /**
   * This property can be mutated at runtime by the user to indicate that the
   * error has been resolved or handled.
   */
  public suppress = false;

  // We may use line breaks in the code to improve readability, but we don't want
  // to show them to the user, so we remove them.
  constructor(readonly code: number, message: string) {
    super(message.replace(/^\s+|\s+$/gm, ''));
  }
}

export class RouteResolverNotFound extends KitaError {
  constructor(readonly path: string) {
    super(1, `Could not resolve a route parser for the given node`);
  }
}

export class ParameterResolverNotFound extends KitaError {
  constructor(readonly path: string) {
    super(2, `Could not resolve a parameter parser for the given node`);
  }
}

export class CannotResolveParameterError extends KitaError {
  constructor(readonly path: string) {
    super(
      3,
      `Could not resolve the parameter name because you are using a
       destructuring pattern and not providing a name through a 
       string literal`
    );
  }
}

export class CannotCreateNodeType extends KitaError {
  constructor(readonly path: string) {
    super(4, 'Could not create type node for specified type');
  }
}

export class MultipleDefinitionsError extends KitaError {
  constructor(readonly typename: string) {
    super(5, `Type "${typename}" has multiple definitions.`);
  }
}

export class BodyInGetRequestError extends KitaError {
  constructor() {
    super(6, `You cannot use any Body dependent code in a GET request.`);
  }
}

export class ParameterConflictError extends KitaError {
  constructor(readonly existing: string, readonly attempt: string, readonly schema: unknown) {
    super(
      7,
      `You cannot use ${attempt} when ${existing} is already used in
       the same route.`
    );
  }
}

export class InvalidParameterUsageError extends KitaError {
  constructor(readonly param: string, readonly usage: string) {
    super(8, `Invalid parameter usage for ${param}: ${usage}`);
  }
}

export class SourceFileNotFoundError extends KitaError {
  constructor(readonly path: string, readonly importReason?: string) {
    super(9, `Source file not found: ${path}`);
  }
}

export class CannotReadTsconfigError extends KitaError {
  constructor(readonly path: string, readonly error: ts.Diagnostic) {
    super(10, `Cannot read tsconfig file: ${path}`);
  }
}

export class CannotParseTsconfigError extends KitaError {
  constructor(readonly path: string, readonly errors: ts.Diagnostic[]) {
    super(11, `Cannot parse tsconfig file: ${path}`);
  }
}

export class DuplicateOperationIdError extends KitaError {
  constructor(readonly operationId: string, readonly previousPath: string, readonly duplicatePath: string) {
    super(12, `Duplicate operationId: ${operationId}`);
  }
}

export class DuplicateProviderType extends KitaError {
  constructor(readonly type: string, readonly pathA: string, readonly pathB: string) {
    super(13, `Found duplicate provider type: ${type}`);
  }
}

export class NoProviderExported extends KitaError {
  constructor(readonly path: string) {
    super(
      14,
      `No default function exported at ${path}. You must export a default
      function on every file matching the provider glob.`
    );
  }
}

export class UntypedProvider extends KitaError {
  constructor(readonly path: string) {
    super(
      15,
      `
      The default export at ${path} needs to have a return type declared.
    `
    );
  }
}

export class UntypedPromise extends KitaError {
  constructor(readonly path: string) {
    super(16, `You cannot use an untyped promise as a return type at ${path}.`);
  }
}

export class AgnosticRouteConflict extends KitaError {
  constructor(readonly path: string) {
    super(
      17,
      `You cannot use dependent routes within agnostic contexts. You are
       probably using an unsupported route parameter within a provider.`
    );
  }
}
