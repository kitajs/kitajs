import { GeneratedDiagnosticsErrors, KitaConfig, SourceWriter } from '@kitajs/common';
import { EOL } from 'os';
import path from 'path';
import ts from 'typescript';
import { escapePath } from './util/path';

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
      this.compilerOptions.outDir = path.resolve(this.config.cwd, this.config.runtimePath);
    } else {
      this.compilerOptions.outDir = path.dirname(
        require.resolve('@kitajs/runtime/generated', {
          // Allows global installations to work
          paths: [this.config.cwd]
        })
      );
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

    // Make sure we always emit the files
    this.compilerOptions.noEmit = false;

    // Performance improvements
    this.compilerOptions.noResolve = true;
    this.compilerOptions.skipDefaultLibCheck = true;
    this.compilerOptions.skipLibCheck = true;
    this.compilerOptions.checkJs = false;
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

    // To avoid overwrite source files after second `tsc` run,
    // we keep aliases inside tsconfig for dts files and use relative
    // paths inside .js files
    host.writeFile = (filename, content, writeByteOrderMark) => {
      if (
        // Only if we should switch to the dist folder
        this.userDistPath &&
        // only JS files should be changed
        filename.endsWith('.js')
      ) {
        // Replace's all require statements with the dist folder
        content = content.replaceAll(
          `require("${src}`,
          (line) =>
            `require("${escapePath(
              path.relative(
                // The file directory
                path.dirname(filename),
                path.join(
                  // the user's dist folder
                  this.userDistPath as string,
                  // the user's source folder without the `require("` and the source folder
                  line.slice(`require("`.length + src.length)
                )
              )
            )}`
        );
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
