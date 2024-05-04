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
    }),
    routes: Flags.boolean({
      char: 'R',
      description: 'Prints the routes.',
      default: false
    }),
    schemas: Flags.boolean({
      char: 's',
      description: 'Prints the schemas.',
      default: false
    }),
    providers: Flags.boolean({
      char: 'P',
      description: 'Prints the providers.',
      default: false
    }),
    plugins: Flags.boolean({
      char: 'p',
      description: 'Prints the plugins.',
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
      routes: flags.routes ? parser.getRoutes() : [],
      schemas: flags.schemas ? parser.getSchemas() : [],
      providers: flags.providers ? parser.getProviders() : [],
      plugins: flags.plugins ? parser.getPlugins() : [],
      errors: errors.map((err) => ({
        ...err,
        diagnostic: ts.formatDiagnostic(err.diagnostic, {
          getCanonicalFileName: (f) => f,
          getCurrentDirectory: () => '',
          getNewLine: () => '\n'
        })
      }))
    };

    if (flags.raw) {
      this.log(JSON.stringify(ast));
    } else {
      this.logJson(ast);
    }
  }
}
