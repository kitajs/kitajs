import type ts from 'typescript';
import { KitaError } from './base';

export class GeneratedDiagnosticsErrors extends KitaError {
  override type = 'formatter';

  constructor(diagnostics: readonly ts.Diagnostic[]) {
    super({
      code: 500,
      messageText: 'Generated code was invalid. Please report this issue to the KitaJS team.',
      relatedInformation: Array.from(diagnostics)
    });
  }
}

export class UnreachableRuntime extends KitaError {
  override type = 'formatter';

  constructor(
    readonly path: string,
    error: Error
  ) {
    super({
      code: 501,
      messageText: `Could not create runtime at ${path}: ${String(error)}`
    });
  }
}
