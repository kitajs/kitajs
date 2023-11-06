import { KitaFormatter } from '@kitajs/generator';
import { KitaParser } from '@kitajs/parser';
import { Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { BaseKitaCommand } from '../util/base';

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
      default: false
    }),
    ['js-only']: Flags.boolean({
      char: 'j',
      description: 'Skips emitting declaration files.',
      default: false,
      exclusive: ['dry-run']
    }),
    reset: Flags.boolean({
      char: 'r',
      description: 'Removes previous generated files before each build.',
      default: false,
      exclusive: ['dry-run']
    }),
    ignore: Flags.directory({
      description: 'Directories to ignore when watching for changes.',
      multiple: true,
      default: ['node_modules'],
      char: 'i'
    })
  };

  async run(): Promise<void> {
    this.printSponsor();

    const { flags } = await this.parse(Watch);

    const { config, compilerOptions } = this.parseConfig(flags, {
      declaration: !flags['js-only'],
      watch: { ignore: flags.ignore }
    });

    ux.action.start('Warming up', '', {
      stdout: true,
      style: 'clock'
    });

    const formatter = flags['dry-run'] ? undefined : new KitaFormatter(config);

    const parser = KitaParser.createWatcher(
      config,
      compilerOptions,
      // Dry runs should not generate any files
      formatter
    );

    ux.action.stop(chalk`{cyan Ready to build!}`);

    parser.onError = (err) => this.logToStderr(String(err));

    parser.onChange = async (parser) => {
      await this.runParser(parser, formatter, flags.reset, config);

      if (parser.getRouteCount() === 0) {
        this.warn(chalk`{yellow No routes were found!}`);
      }

      // This newline is important to avoid mixing the output with the
      // previous parser output
      this.log('');
    };
  }
}
