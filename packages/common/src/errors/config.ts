import type ts from 'typescript';
import { KitaError } from './base';

export class InvalidConfigError extends KitaError {
  code = 200;

  constructor(message: string, private config?: unknown) {
    super(message);
  }
}

export class CannotReadTsconfigError extends KitaError {
  code = 201;

  constructor(private path: string, private error: ts.Diagnostic) {
    super('Cannot read tsconfig file');
  }
}

export class CannotParseTsconfigError extends KitaError {
  code = 202;

  constructor(private path: string, private errors: ts.Diagnostic[]) {
    super('Cannot parse tsconfig file');
  }
}

export class CannotReadConfigError extends KitaError {
  code = 203;

  constructor(private reason: string) {
    super('Cannot read kita config file');
  }
}
