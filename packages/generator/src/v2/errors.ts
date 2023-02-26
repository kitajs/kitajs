import type ts from 'typescript';

export class KitaError extends Error {
  constructor(message: string) {
    // We may use line breaks in the code to improve readability, but we don't want
    // to show them to the user, so we remove them.
    super(
      message
        .split('\n')
        .map((l) => l.trim())
        .join(' ')
    );
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
      `Could not resolve the parameter name
       because you are using a destructuring pattern
       and not providing a name through a string literal`
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
  constructor(name: string) {
    super(`Type "${name}" has multiple definitions.`);
  }
}
