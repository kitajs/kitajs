import type ts from 'typescript';

export class KitaError extends Error {}

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
