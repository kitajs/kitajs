import { KitaError } from './base';

export class MultipleDefinitionsError extends KitaError {
  code = 400;

  constructor(private typename: string) {
    super(`Provided typename has multiple definitions.`);
  }
}

export class BodyInGetRequestError extends KitaError {
  code = 401;

  constructor(private path: string) {
    super(`You cannot use any Body dependent code in a GET request.`);
  }
}

export class ParameterConflictError extends KitaError {
  code = 402;

  constructor(private existing: string, private attempt: string, private schema: unknown) {
    super(
      `You cannot use ${attempt} when ${existing} is already used in
       the same route.`
    );
  }
}

export class InvalidParameterUsageError extends KitaError {
  code = 403;

  constructor(private parameter: string, private usage: string, private path: string) {
    super(`Invalid parameter usage for this parameter`);
  }
}

export class DuplicateOperationIdError extends KitaError {
  code = 404;

  constructor(private operationId: string, private previousPath: string, private duplicatePath: string) {
    super(`Duplicate operationId: ${operationId}`);
  }
}

export class DuplicateProviderTypeError extends KitaError {
  code = 405;

  constructor(private type: string, private pathA: string, private pathB: string) {
    super(`Found duplicate provider type: ${type}`);
  }
}

export class AgnosticRouteConflictError extends KitaError {
  code = 406;

  constructor(private path: string) {
    super(
      `You cannot use dependent routes within agnostic contexts. You are
       probably using a method dependent route parameter within a provider.`
    );
  }
}

export class JsdocAlreadyDefinedError extends KitaError {
  code = 407;

  constructor(private tagname: string, private path: string) {
    super(
      `You are trying to use a JSDoc tag on a node that already had this value
      explicit set.`
    );
  }
}

export class QueryMixError extends KitaError {
  code = 408;

  constructor(private path: string) {
    super(`You are mixing primitive and deep query types inside the same route.`);
  }
}
