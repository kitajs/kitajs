import ts from 'typescript';
import { KitaError } from './base';

export class MultipleDefinitionsError extends KitaError {
  override type = 'validator';

  constructor(readonly typename: string) {
    super({
      code: 400,
      messageText: 'Provided typename has multiple definitions.'
    });
  }
}

export class BodyInGetRequestError extends KitaError {
  override type = 'validator';

  constructor(node: ts.Node) {
    super({
      code: 401,
      messageText: 'You cannot use any Body dependent code in a GET request.',
      node
    });
  }
}

export class ParameterConflictError extends KitaError {
  override type = 'validator';

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
  override type = 'validator';

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
  override type = 'validator';

  constructor(
    readonly operationId: string,
    readonly node?: ts.Node
  ) {
    super({
      code: 404,
      node,
      messageText: `Duplicate operationId: ${operationId}`
    });
  }
}

export class DuplicateProviderTypeError extends KitaError {
  override type = 'validator';

  constructor(
    readonly provider: string,
    readonly pathA: string,
    readonly pathB: string
  ) {
    super({
      code: 405,
      messageText: `Duplicate provider: ${provider}`,
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

export class JsdocAlreadyDefinedError extends KitaError {
  override type = 'validator';

  constructor(node: ts.Node) {
    super({
      code: 406,
      messageText: 'You are trying to use a JSDoc tag on a node that already had this value explicit set.',
      node
    });
  }
}

export class QueryMixError extends KitaError {
  override type = 'validator';

  constructor(node: ts.Node) {
    super({
      code: 407,
      messageText: 'You are mixing primitive and deep query types inside the same route.',
      node
    });
  }
}

export class InvalidHtmlRoute extends KitaError {
  override type = 'validator';

  constructor(
    node: ts.Node,
    readonly primitive?: unknown
  ) {
    super({
      code: 408,
      messageText: 'You cannot use a non-string return type in a HTML route.',
      node
    });
  }
}

export class UnknownHttpError extends KitaError {
  override type = 'validator';

  constructor(node: ts.Node) {
    super({
      code: 409,
      messageText:
        'Could not resolve a http status code for this error, are you using a method exposed by @fastify/sensible?',
      node
    });
  }
}

export class UnknownHttpJsdocError extends KitaError {
  override type = 'validator';

  constructor(node: ts.Node) {
    super({
      code: 410,
      messageText: 'Could not resolve a http status code for this error, please only use @throws <number>',
      node
    });
  }
}

export class FileInGetRequestError extends KitaError {
  override type = 'validator';

  constructor(node: ts.Node) {
    super({
      code: 411,
      messageText: 'You cannot use any File and SavedFile in a GET request.',
      node
    });
  }
}

export class DefaultExportedRoute extends KitaError {
  override type = 'validator';

  constructor(node: ts.Node) {
    super({
      code: 412,
      messageText: 'You cannot use default exported routes. Please remove the `default` modifier',
      node
    });
  }
}

export class RouteWithoutReturnError extends KitaError {
  override type = 'validator';

  constructor(node: ts.Node) {
    super({
      code: 413,
      messageText:
        'You cannot have a route that returns `undefined`, please use other value such as `true`, `""` or `null`.',
      node
    });
  }
}
