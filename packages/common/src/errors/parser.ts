import { KitaError } from './base';

export class RouteResolverNotFoundError extends KitaError {
  code = 300;

  constructor(readonly path: string) {
    super(`Could not resolve a route parser for the given node`);
  }
}

export class ParameterResolverNotFoundError extends KitaError {
  code = 301;

  constructor(readonly path: string) {
    super(`Could not resolve a parameter parser for the given node`);
  }
}

export class CannotResolveParameterError extends KitaError {
  code = 302;

  constructor(readonly path: string) {
    super(
      `Could not resolve the parameter name because you are using a
       destructuring pattern and not providing a name through a 
       string literal`
    );
  }
}

export class CannotCreateNodeTypeError extends KitaError {
  code = 303;

  constructor(readonly path: string) {
    super('Could not create type node for specified type');
  }
}

export class SourceFileNotFoundError extends KitaError {
  code = 304;

  constructor(readonly path: string, readonly importReason?: string) {
    super(`Source file not found`);
  }
}

export class NoProviderExportedError extends KitaError {
  code = 305;

  constructor(readonly path: string) {
    super(
      `No default function exported at this path. You must export a default
      function on every file matching the provider glob.`
    );
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

  constructor(readonly tagname: string, readonly path: string) {
    super(`You forgot to provide a value for this JSDoc tag.`);
  }
}

export class ProviderResolverNotFound extends KitaError {
  code = 309;

  constructor(readonly path: string) {
    super(`Could not resolve a provider parser for the given node`);
  }
}
