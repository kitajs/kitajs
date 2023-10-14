import { GeneratedDiagnosticsErrors, KitaConfig, SourceWriter } from '@kitajs/common';
import { EOL } from 'os';
import path from 'path';
import ts from 'typescript';
import { PREVIOUS_DIR, escapePath } from './util/path';

export class KitaWriter implements SourceWriter {
  private readonly files: Map<string, string> = new Map();

  private userDistPath: string | false;

  constructor(
    private compilerOptions: ts.CompilerOptions,
    private config: KitaConfig
  ) {
    this.userDistPath = this.config.dist ? path.resolve(this.config.cwd, this.compilerOptions.outDir || 'dist') : false;

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

    // Performance improvements
    this.compilerOptions.noResolve = true;
    this.compilerOptions.skipDefaultLibCheck = true;
    this.compilerOptions.skipLibCheck = true;
    this.compilerOptions.incremental = false;
  }

  write(filename: string, content: string) {
    let current = this.files.get(filename);

    if (current) {
      current = current + EOL + content;
    } else {
      current = content;
    }

    this.files.set(filename, current.trim());
  }

  async flush() {
    const host = ts.createIncrementalCompilerHost(this.compilerOptions);

    // Reads the file from memory
    host.readFile = (filename) => {
      return this.files.get(filename) || ts.sys.readFile(filename);
    };

    const src = escapePath(path.join(this.config.cwd, this.config.src));
    const escapedSep = escapePath(path.sep);

    // To avoid overwrite source files after second `tsc` run,
    // we keep aliases inside tsconfig for dts files and use relative
    // paths inside .js files
    host.writeFile = (filename, content, writeByteOrderMark) => {
      // Change javascript code to import from the correct location
      if (this.userDistPath && filename.endsWith('.js')) {
        content = content.replaceAll(`require("${src}`, (line, index) => {
          // `/path/file");\n...` -> `path/file");`
          // \n used because we do not change newLine setting inside tsconfig
          const rest = content.slice(index + line.length + escapedSep.length).split('\n')[0] || '';
          const dirsDeep = rest.split(escapedSep).length - 1;

          // dist + the amount of deep dist
          return `require("${escapePath(
            path.join(PREVIOUS_DIR.repeat(dirsDeep), path.relative(src, this.userDistPath as string))
          )}`;
        });
      }

      return ts.sys.writeFile(filename, content, writeByteOrderMark);
    };

    // Creates the program and emits the files
    const program = ts.createIncrementalProgram({
      options: this.compilerOptions,
      rootNames: Array.from(this.files.keys()),
      host
    });

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
