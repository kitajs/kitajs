import { BaseType } from 'ts-json-schema-generator';
import { KitaError } from './base';

export class MultipleDefinitionsError extends KitaError {
  code = 400;

  constructor(readonly typename: string) {
    super(`Provided typename has multiple definitions.`);
  }
}

export class BodyInGetRequestError extends KitaError {
  code = 401;

  constructor(readonly path: string) {
    super(`You cannot use any Body dependent code in a GET request.`);
  }
}

export class ParameterConflictError extends KitaError {
  code = 402;

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
  code = 403;

  constructor(
    readonly parameter: string,
    readonly usage: string,
    readonly path: string
  ) {
    super(`Invalid parameter usage for this parameter`);
  }
}

export class DuplicateOperationIdError extends KitaError {
  code = 404;

  constructor(
    readonly operationId: string,
    readonly previousPath: string,
    readonly duplicatePath: string
  ) {
    super(`Duplicate operationId: ${operationId}`);
  }
}

export class DuplicateProviderTypeError extends KitaError {
  code = 405;

  constructor(
    readonly type: string,
    readonly pathA: string,
    readonly pathB: string
  ) {
    super(`Found duplicate provider type: ${type}`);
  }
}

export class AgnosticRouteConflictError extends KitaError {
  code = 406;

  constructor(readonly path: string) {
    super(
      `You cannot use dependent routes within agnostic contexts. You are
       probably using a method dependent route parameter within a provider.`
    );
  }
}

export class JsdocAlreadyDefinedError extends KitaError {
  code = 407;

  constructor(
    readonly tagname: string,
    readonly path: string
  ) {
    super(
      `You are trying to use a JSDoc tag on a node that already had this value
      explicit set.`
    );
  }
}

export class QueryMixError extends KitaError {
  code = 408;

  constructor(readonly path: string) {
    super(`You are mixing primitive and deep query types inside the same route.`);
  }
}

export class InvalidHtmlRoute extends KitaError {
  code = 409;

  constructor(
    readonly path: string,
    readonly type?: BaseType
  ) {
    super(`You cannot use a non-string return type in a HTML route.`);
  }
}
