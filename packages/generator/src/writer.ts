import { GeneratedDiagnosticsErrors, KitaConfig, SourceWriter } from '@kitajs/common';
import { EOL } from 'os';
import path from 'path';
import { Promisable } from 'type-fest';
import ts from 'typescript';

export class KitaWriter implements SourceWriter {
  private readonly files: Map<string, string> = new Map();

  constructor(
    private readonly config: KitaConfig,
    private compilerOptions: ts.CompilerOptions
  ) {
    const runtime = config.runtime
      ? path.resolve(config.cwd, config.runtime)
      : path.dirname(require.resolve('@kitajs/runtime/generated'));

    if (!ts.sys.directoryExists(runtime)) {
      throw new Error(`Could not found the runtime path to generate the code.`);
    }

    // Copies the compiler options
    this.compilerOptions = Object.assign({}, this.compilerOptions);

    // Finds the runtime directory
    this.compilerOptions.outDir = runtime;

    // Type information is needed for the runtime
    this.compilerOptions.declaration = true;

    // No real src files are being written, so source maps are useless
    this.compilerOptions.declarationMap = false;
    this.compilerOptions.sourceMap = false;

    // Enables strict mode to check against generated code
    this.compilerOptions.strict = true;

    // Keeps warnings and other debug information
    this.compilerOptions.removeComments = false;

    // reduces the size of the generated code
    this.compilerOptions.importHelpers = true;
  }

  write(filename: string, content: string): Promisable<void> {
    let current = this.files.get(filename);

    if (current) {
      current = current + '\n' + content;
    } else {
      current = content;
    }

    this.files.set(filename, current.trim());
  }

  flush() {
    const host = ts.createCompilerHost(this.compilerOptions, false);

    // Reads the file from memory
    host.readFile = (filename) => {
      return this.files.get(filename);
    };

    // Creates the program and emits the files
    const program = ts.createProgram(Array.from(this.files.keys()), this.compilerOptions, host);
    const emitResult = program.emit();

    // Throws an error if there are any diagnostics errors
    if (emitResult.diagnostics.length) {
      const host: ts.FormatDiagnosticsHost = {
        getCanonicalFileName: (f) => f,
        getCurrentDirectory: () => this.config.cwd,
        getNewLine: () => EOL
      };

      throw new GeneratedDiagnosticsErrors(emitResult.diagnostics.map((d) => ts.formatDiagnostic(d, host)));
    }
  }
}
