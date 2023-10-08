import { GeneratedDiagnosticsErrors, SourceWriter } from '@kitajs/common';
import { Promisable } from 'type-fest';
import ts from 'typescript';

export class KitaWriter implements SourceWriter {
  private readonly files: Map<string, string> = new Map();

  constructor(
    private compilerOptions: ts.CompilerOptions,
    cwd: string
  ) {
    // Copies the compiler options
    this.compilerOptions = Object.assign({}, this.compilerOptions);

    // Finds the runtime directory
    this.compilerOptions.outDir = cwd;

    // TODO: Figure out esm
    this.compilerOptions.module = ts.ModuleKind.CommonJS;

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

    // We use @internal to hide some generated code
    this.compilerOptions.stripInternal = true;
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
      return this.files.get(filename) || ts.sys.readFile(filename);
    };

    // Creates the program and emits the files
    const program = ts.createProgram(Array.from(this.files.keys()), this.compilerOptions, host);

    const diagnostics = [
      program.emit().diagnostics,
      program.getGlobalDiagnostics(),
      program.getOptionsDiagnostics(),
      program.getSyntacticDiagnostics(),
      program.getDeclarationDiagnostics(),
      program.getConfigFileParsingDiagnostics()
    ].flat(1);

    // Throws an error if there are any diagnostics errors
    if (diagnostics.length) {
      throw new GeneratedDiagnosticsErrors(diagnostics);
    }
  }

  fileCount() {
    return this.files.size;
  }
}
