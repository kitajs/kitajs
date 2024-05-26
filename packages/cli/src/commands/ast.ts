import { KitaParser } from '@kitajs/parser';
import { Flags } from '@oclif/core';
import ts from 'typescript';
import { BaseKitaCommand } from '../util/base';

export default class Ast extends BaseKitaCommand {
  static override description = "Prints the full Kita's AST object for debugging purposes";

  static override flags = {
    raw: Flags.boolean({
      char: 'r',
      description: 'Prints a raw JSON string instead of a pretty printed one.',
      default: false
    })
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Ast);
    const { config, compilerOptions } = this.parseConfig(flags, undefined, false);

    const parser = KitaParser.create(config, compilerOptions, compilerOptions.rootNames);

    // Ignores all errors, just generates something
    const errors = Array.from(parser.parse());

    const ast = {
      routes: parser.getRoutes(),
      schemas: parser.getSchemas(),
      providers: parser.getProviders(),
      plugins: parser.getPlugins(),
      errors: errors.map((err) => ({
        ...err,
        diagnostic: {
          ...err.diagnostic,
          file: err.diagnostic.file?.fileName,
          prettyMessageText: ts.formatDiagnostic(err.diagnostic, {
            getCanonicalFileName: (f) => f,
            getCurrentDirectory: () => '',
            getNewLine: () => '\n'
          })
        }
      }))
    };

    if (flags.raw) {
      this.log(JSON.stringify(ast));
    } else {
      this.logJson(ast);
    }
  }
}
