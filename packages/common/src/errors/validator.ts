import { BaseType } from 'ts-json-schema-generator';
import ts from 'typescript';
import { KitaError } from './base';

export class MultipleDefinitionsError extends KitaError {
  constructor(readonly typename: string) {
    super({
      code: 400,
      messageText: `Provided typename has multiple definitions.`
    });
  }
}

export class BodyInGetRequestError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 401,
      messageText: `You cannot use any Body dependent code in a GET request.`,
      node
    });
  }
}

export class ParameterConflictError extends KitaError {
  constructor(
    readonly existing: string,
    readonly attempt: string,
    node: ts.Node
  ) {
    super({
      code: 402,
      messageText: `You cannot use ${attempt} when ${existing} is already used in the same route.`,
      node
    });
  }
}

export class InvalidParameterUsageError extends KitaError {
  constructor(
    readonly usage: string,
    node: ts.Node
  ) {
    super({
      code: 403,
      messageText: `Invalid parameter usage: ${usage}`,
      node
    });
  }
}

export class DuplicateOperationIdError extends KitaError {
  constructor(
    readonly operationId: string,
    readonly previousPath: string,
    readonly currentPath: string
  ) {
    super({
      code: 404,
      messageText: `Duplicate operationId: ${operationId}`,
      relatedInformation: [
        KitaError.createDiagnostic({
          file: ts.createSourceFile(previousPath, '', ts.ScriptTarget.ES2015),
          code: 404,
          messageText: `Previous operationId: ${operationId}`
        }),
        KitaError.createDiagnostic({
          file: ts.createSourceFile(currentPath, '', ts.ScriptTarget.ES2015),
          code: 404,
          messageText: `Current operationId: ${operationId}`
        })
      ]
    });
  }
}

export class DuplicateProviderTypeError extends KitaError {
  constructor(
    readonly type: string,
    readonly pathA: string,
    readonly pathB: string
  ) {
    super({
      code: 405,
      messageText: `Duplicate provider: ${type}`,
      relatedInformation: [
        KitaError.createDiagnostic({
          file: ts.createSourceFile(pathA, '', ts.ScriptTarget.ES2015),
          code: 405,
          messageText: `Provider 1: ${pathA}`
        }),
        KitaError.createDiagnostic({
          file: ts.createSourceFile(pathB, '', ts.ScriptTarget.ES2015),
          code: 405,
          messageText: `Provider 2: ${pathB}`
        })
      ]
    });
  }
}

export class AgnosticRouteConflictError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 406,
      messageText: `You cannot use dependent routes within agnostic contexts. You are probably using a method dependent route parameter within a provider.`,
      node
    });
  }
}

export class JsdocAlreadyDefinedError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 407,
      messageText: `You are trying to use a JSDoc tag on a node that already had this value explicit set.`,
      node
    });
  }
}

export class QueryMixError extends KitaError {
  constructor(node: ts.Node) {
    super({
      code: 408,
      messageText: `You are mixing primitive and deep query types inside the same route.`,
      node
    });
  }
}

export class InvalidHtmlRoute extends KitaError {
  constructor(
    node: ts.Node,
    readonly primitive?: BaseType
  ) {
    super({
      code: 409,
      messageText: `You cannot use a non-string return type in a HTML route.`,
      node
    });
  }
}
