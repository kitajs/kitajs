import { AstCollector, KitaConfig, SourceFormatter, readCompilerOptions } from '@kitajs/common';
import { Command, Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { readConfig } from './config';
import { formatDiagnostic, formatStatus } from './diagnostics';

export abstract class BaseKitaCommand extends Command {
  static override baseFlags = {
    config: Flags.file({
      char: 'c',
      exists: true,
      description: 'Path to your kita.config.js file, if any.'
    }),
    ['print-config']: Flags.boolean({
      description: 'Prints full resolved config to stdout.',
      default: false,
      allowNo: true
    }),
    cwd: Flags.directory({
      description: 'Sets the current working directory for your command.',
      required: false
    })
  };

  protected parseConfig(flags: Record<string, any>, extension?: Partial<KitaConfig>) {
    const config = readConfig(flags.cwd ?? process.cwd(), this.error, flags.config, extension);

    if (flags['print-config']) {
      ux.styledJSON(config);
      this.exit(0);
    }

    const compilerOptions = readCompilerOptions(config.tsconfig);

    return { config, compilerOptions };
  }

  protected async runParser(parser: AstCollector, formatter: SourceFormatter, dryRun: boolean) {
    ux.action.start('Parsing sources', '', {
      stdout: true,
      style: 'clock'
    });

    const diagnostics = [];

    // Should not emit any errors
    for await (const error of parser.parse()) {
      diagnostics.push(error.diagnostic);
    }

    ux.action.stop(formatStatus(parser, diagnostics));

    if (diagnostics.length) {
      this.log(formatDiagnostic(diagnostics));
    }

    if (dryRun) {
      this.log(chalk.yellow`Skipping generation process.`);
    } else {
      ux.action.start(`Generating ${chalk.cyan`@kitajs/runtime`}`, '', {
        stdout: true,
        style: 'clock'
      });

      const writeCount = await formatter.flush();

      ux.action.stop(`${chalk.green(writeCount)} files written.`);
    }

    return diagnostics;
  }
}
