import ts from 'typescript';
import { KitaError } from './base';

export class InvalidConfigError extends KitaError {
  constructor(
    message: string,
    readonly config?: unknown
  ) {
    super({
      code: 200,
      messageText: message
    });
  }
}

export class CannotReadTsconfigError extends KitaError {
  constructor(
    readonly path: string,
    error: ts.Diagnostic
  ) {
    super({
      code: 201,
      messageText: 'Cannot read tsconfig file',
      relatedInformation: [error]
    });
  }
}

export class CannotParseTsconfigError extends KitaError {
  constructor(
    readonly path: string,
    errors: ts.Diagnostic[]
  ) {
    super({
      code: 202,
      messageText: 'Cannot read tsconfig file',
      relatedInformation: errors
    });
  }
}

export class CannotReadConfigError extends KitaError {
  constructor(readonly reason: string) {
    super({
      code: 203,
      messageText: 'Cannot read kita tsconfig file.'
    });
  }
}
