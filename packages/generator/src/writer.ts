import { GeneratedDiagnosticsErrors, KitaConfig, SourceWriter } from '@kitajs/common';
import path from 'path';
import ts from 'typescript';

export class KitaWriter implements SourceWriter {
  private readonly files: Map<string, string> = new Map();

  private userDirPath: string | false;

  constructor(
    private compilerOptions: ts.CompilerOptions,
    private config: KitaConfig
  ) {
    this.userDirPath = this.config.dist ? path.resolve(this.config.cwd, this.compilerOptions.outDir || 'dist') : false;

    // Copies the compiler options
    this.compilerOptions = Object.assign({}, this.compilerOptions);

    // Finds the correct runtime directory
    if (this.config.runtimePath) {
      this.compilerOptions.outDir = path.resolve(this.config.runtimePath);
    } else {
      this.compilerOptions.outDir = path.dirname(require.resolve('@kitajs/runtime/generated'));
    }

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
    this.compilerOptions.noResolve = true;
  }

  write(filename: string, content: string) {
    let current = this.files.get(filename);

    if (current) {
      current = current + '\n' + content;
    } else {
      current = content;
    }

    this.files.set(filename, current.trim());
  }

  async flush() {
    console.log(this.files);

    const host = ts.createCompilerHost(this.compilerOptions, false);

    // Reads the file from memory
    host.readFile = (filename) => {
      return this.files.get(filename) || ts.sys.readFile(filename);
    };

    // To avoid overwrite source files after second `tsc` run,
    // we keep aliases inside tsconfig for dts files and use relative
    // paths inside .js files
    host.writeFile = (filename, content) => {
      // Change javascript code to import from the correct location
      if (this.userDirPath && filename.endsWith('.js')) {
        // TODO: Add support for other entry folders than src, like `lib` or `source`
        content = content.replaceAll(`require("${this.config.cwd}/src`, `require("${this.userDirPath}`);
      }

      console.log(content);

      return ts.sys.writeFile(filename, content);
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
