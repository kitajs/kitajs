import { KitaError } from '@kitajs/common';
import { KitaFormatter } from '@kitajs/generator';
import { KitaParser } from '@kitajs/parser';
import { Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { BaseKitaCommand } from '../util/base';
import { formatDiagnostic } from '../util/diagnostics';

export default class Build extends BaseKitaCommand {
  static override description = 'Analyses your backend searching for routes and bakes it into the runtime.';

  static override examples = [
    {
      command: `<%= config.bin %> <%= command.id %> -c kita.config.js`,
      description: 'Builds your backend with a custom config file.'
    },
    {
      command: `<%= config.bin %> <%= command.id %> -d`,
      description: 'Fast checks your backend for errors without generating the runtime.'
    }
  ];

  static override aliases = ['b'];

  static override flags = {
    ['dry-run']: Flags.boolean({
      char: 'd',
      description: 'Skips generation process and only type-checks your files.',
      default: false,
      allowNo: true
    }),
    types: Flags.boolean({
      char: 't',
      description: 'Skips emitting declaration files.',
      default: true,
      allowNo: true
    })
  };

  async run(): Promise<void> {
    this.printSponsor();

    const { flags } = await this.parse(Build);

    if (!flags['print-config']) {
      ux.action.start('Warming up', '', {
        stdout: true,
        style: 'clock'
      });
    }

    const { config, compilerOptions } = this.parseConfig(flags, { declaration: flags.types });

    try {
      const formatter = new KitaFormatter(config);

      const parser = KitaParser.create(
        config,
        compilerOptions,
        // Prefer already looked up files instead of walking the folder again
        compilerOptions.rootNames,
        // Dry runs should not generate any files
        flags['dry-run'] ? undefined : formatter
      );

      ux.action.stop(chalk.cyan`Ready to build!`);

      const diagnostics = await this.runParser(parser, formatter, flags['dry-run']);

      if (diagnostics.length > 0) {
        this.error(chalk.red`Finished with errors!`);
      }

      if (process.stdout.isTTY) {
        if (flags['dry-run']) {
          this.log(chalk.green`\nNo errors were found!`);
        } else {
          this.log(chalk.green`\nRuntime is ready to use!`);
        }
      }
    } catch (error) {
      if (error instanceof KitaError) {
        this.error(formatDiagnostic([error.diagnostic]));
      }

      throw error;
    }
  }
}
