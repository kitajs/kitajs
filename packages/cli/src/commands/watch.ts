import { KitaError } from '@kitajs/common';
import { KitaFormatter } from '@kitajs/generator';
import { KitaParser } from '@kitajs/parser';
import { Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { BaseKitaCommand } from '../util/base';
import { formatDiagnostic } from '../util/diagnostics';

export default class Watch extends BaseKitaCommand {
  static override description = 'Watch for changes in your source code and rebuilds the runtime.';

  static override examples = [
    {
      command: `<%= config.bin %> <%= command.id %> -c kita.config.js`,
      description: 'Watches your source with a custom config file.'
    },
    {
      command: `<%= config.bin %> <%= command.id %> -d`,
      description: 'Watches your source and only emits errors.'
    }
  ];

  static override aliases = ['w'];

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
    }),
    ignore: Flags.directory({
      description: 'Watches for changes and rebuilds the runtime.',
      multiple: true,
      default: ['node_modules'],
      char: 'i'
    })
  };

  async run(): Promise<void> {
    this.printSponsor();

    const { flags } = await this.parse(Watch);

    if (!flags['print-config']) {
      ux.action.start('Warming up', '', {
        stdout: true,
        style: 'clock'
      });
    }

    const { config, compilerOptions } = this.parseConfig(flags, { declaration: flags.types });

    try {
      const formatter = new KitaFormatter(config);

      const parser = KitaParser.createWatcher(
        config,
        compilerOptions,
        // Dry runs should not generate any files
        flags['dry-run'] ? undefined : formatter
      );

      ux.action.stop(chalk.cyan`Ready to build!`);

      parser.onError = (err) => this.logToStderr(String(err));

      parser.onChange = async (parser) => {
        await this.runParser(parser, formatter, flags['dry-run']);
        this.log('');
      };
    } catch (error) {
      if (error instanceof KitaError) {
        this.error(formatDiagnostic([error.diagnostic]));
      }

      throw error;
    }
  }
}
