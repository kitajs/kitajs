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
  constructor(node: ts.Node) {
    super({
      code: 303,
      messageText: 'Could not create type node for specified type',
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
  code = 306;

  constructor(readonly path: string) {
    super(`The provider default export needs to have a explicit return type declared.`);
  }
}

export class UntypedPromiseError extends KitaError {
  code = 307;

  constructor(readonly path: string) {
    super(`You cannot use an untyped promise as a return type at this path.`);
  }
}

export class EmptyJsdocError extends KitaError {
  code = 308;

  constructor(
    readonly tagname: string,
    readonly path: string
  ) {
    super(`You forgot to provide a value for this JSDoc tag.`);
  }
}

export class ProviderResolverNotFound extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 309,
      messageText: `Could not find a provider resolver for this function.`,
      node
    });
  }
}

export class WronglyTypedProviderError extends KitaError {
  code = 310;

  constructor(
    readonly currentType: string,
    readonly path: string
  ) {
    super(`The provider function resolver return type must be a type reference, no other types are allowed.`);
  }
}

export class ReturnTypeError extends KitaError {
  code = 311;

  constructor(
    readonly path: string,
    readonly error: unknown
  ) {
    super(`Could not resolve return type of provided function.`);
  }
}

export class RouteOptionsAlreadyDefinedError extends KitaError {
  code = 312;

  constructor(readonly path: string) {
    super('This route already has defined options.');
  }
}

export class RouteMapperNotExportedError extends KitaError {
  code = 313;

  constructor(
    readonly mapperName: string,
    readonly path: string
  ) {
    super(
      'You are using a route mapper inside a `this: Use<>` parameter, but the mapper is not exported in the same file.'
    );
  }
}
