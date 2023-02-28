import type ts from 'typescript';

/**
 * A KitaError instance is thrown when something goes wrong during the
 * parsing, resolving or generation process.
 *
 * All errors that you can expect to be thrown by Kita are subclasses of this
 * class.
 */
export abstract class KitaError extends Error {
  // We may use line breaks in the code to improve readability, but we don't want
  // to show them to the user, so we remove them.
  constructor(message: string) {
    super(message.replace(/^\s+|\s+$/gm, ''));
  }
}

export class RouteResolverNotFound extends KitaError {
  constructor(readonly node: ts.Node) {
    super(`Could not resolve a route parser for the given node`);
  }
}

export class ParameterResolverNotFound extends KitaError {
  constructor(readonly node: ts.ParameterDeclaration) {
    super(`Could not resolve a parameter parser for the given node`);
  }
}

export class CannotResolveParameterError extends KitaError {
  constructor(readonly node: ts.ParameterDeclaration) {
    super(
      `Could not resolve the 3rd parameter name because you are using a
       destructuring pattern and not providing a name through a 
       string literal`
    );
  }
}

export class CannotCreateNodeType extends KitaError {
  constructor(readonly node: ts.Node) {
    super(
      `Could not create type for node \`${
        node.getSourceFile() ? node.getText() : '<unknown>'
      }\``
    );
  }
}

export class MultipleDefinitionsError extends KitaError {
  constructor(readonly typename: string) {
    super(`Type "${typename}" has multiple definitions.`);
  }
}

export class BodyInGetRequestError extends KitaError {
  constructor() {
    super(`You cannot use any Body dependent code in a GET request.`);
  }
}

export class ParameterConflictError extends KitaError {
  constructor(
    readonly existing: string,
    readonly attempt: string,
    readonly schema: unknown
  ) {
    super(
      `You cannot use ${attempt} when ${existing} is already used in
       the same route.`
    );
  }
}

export class InvalidParameterUsageError extends KitaError {
  constructor(readonly param: string, readonly usage: string) {
    super(`Invalid parameter usage for ${param}: ${usage}`);
  }
}
