import ts from 'typescript';
import { KitaError } from './base';

export class RouteResolverNotFoundError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 300,
      messageText: 'Could not find a route resolver for this function.',
      node
    });
  }
}

export class ParameterResolverNotFoundError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 301,
      messageText:
        'This parameter type does not have a registered resolved. Did you forget to wrap it into a Body<>, Query<>, etc.?',
      node
    });
  }
}

export class CannotResolveParameterNameError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 302,
      messageText:
        'Could not resolve the parameter name because you are using a destructuring pattern and not providing a name through a string literal',
      node
    });
  }
}

export class CannotCreateNodeTypeError extends KitaError {
  constructor(node: ts.Node, error: unknown) {
    super({
      code: 303,
      messageText: `Could not create type node for specified type: ${String(error)}`,
      node
    });
  }
}

export class SourceFileNotFoundError extends KitaError {
  constructor(readonly path: string) {
    super({
      code: 304,
      messageText: `Could not find source file: ${path}`
    });
  }
}

export class NoProviderExportedError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 305,
      messageText:
        'No default function exported at this path. You must export a default function on every file matching the provider glob.',
      node
    });
  }
}

export class UntypedProviderError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 306,
      messageText: 'The provider default export needs to have a explicit return type declared.',
      node
    });
  }
}

export class EmptyJsdocError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 307,
      messageText: 'You forgot to provide a value for this JSDoc tag.',
      node
    });
  }
}

export class ProviderResolverNotFound extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 308,
      messageText: 'Could not find a provider resolver for this function.',
      node
    });
  }
}

export class WronglyTypedProviderError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 309,
      messageText: 'The provider function resolver return type must be a type reference, no other types are allowed.',
      node
    });
  }
}

export class ReturnTypeError extends KitaError {
  constructor(
    node: ts.Node,
    readonly error: unknown
  ) {
    super({
      code: 310,
      messageText: `Could not resolve return type of provided function: ${String(error)}`,
      node
    });
  }
}

export class RouteOptionsAlreadyDefinedError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 311,
      messageText: 'This route already has defined options.',
      node
    });
  }
}

export class RouteMapperNotExportedError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 312,
      messageText:
        'You are using a route mapper inside a `this: Use<>` parameter, but the mapper is not exported in the same file.',
      node
    });
  }
}

export class RouteParameterMultipleErrors extends KitaError {
  constructor(node: ts.Node, errors: KitaError[]) {
    super({
      code: 313,
      messageText: 'Multiple errors were found while parsing this route.',
      node,
      relatedInformation: errors.map((e) => e.diagnostic)
    });
  }
}

export class InvalidProviderGenericTypeError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 314,
      messageText: 'You can only use literal types as generic types for providers, such as `1`, `true` and `"string"`',
      node
    });
  }
}

export class EmptyRouteFileError extends KitaError {
  constructor(readonly node: ts.Node) {
    super({
      code: 315,
      messageText: 'You cannot have empty route files inside a route directory. Please add at least one route.',
      node
    });
  }
}

export class InvalidProviderSchemaTransformerError extends KitaError {
  constructor(
    node: ts.Node,
    readonly msg: string
  ) {
    super({
      code: 316,
      messageText: `Invalid schemaTransformer: ${msg}`,
      node
    });
  }
}

export class InvalidProviderHookError extends KitaError {
  constructor(
    node: ts.Node,
    readonly msg: string
  ) {
    super({
      code: 317,
      messageText: `Invalid provider hook: ${msg}`,
      node
    });
  }
}
