import { KitaError } from './base';

export class GeneratedDiagnosticsErrors extends KitaError {
  code = 500;

  constructor(readonly diagnostics: string[]) {
    super(`Generated code was invalid. Please report this issue to the KitaJS team.`);
  }
}

export class RuntimeNotFoundError extends KitaError {
  code = 501;

  constructor(
    readonly config: string,
    readonly path: string
  ) {
    super(`Could not found the runtime path to generate the code.`);
  }
}
