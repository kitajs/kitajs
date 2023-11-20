import ts from 'typescript';
import { KitaError } from './base';

export class GeneratedDiagnosticsErrors extends KitaError {
  constructor(diagnostics: readonly ts.Diagnostic[]) {
    super({
      code: 500,
      messageText: 'Generated code was invalid. Please report this issue to the KitaJS team.',
      relatedInformation: Array.from(diagnostics)
    });
  }
}

export class RuntimeNotFoundError extends KitaError {
  constructor(readonly path?: string) {
    super({
      code: 501,
      messageText: `Could not find the runtime package${
        path ? `at ${path}` : ''
      }. Did you forget to install @kitajs/runtime?`
    });
  }
}

export class ProviderHookNotFound extends KitaError {
  constructor(name?: string) {
    super({
      code: 501,
      messageText: `Received a hook for a provider that does not exist: ${name}`
    });
  }
}
