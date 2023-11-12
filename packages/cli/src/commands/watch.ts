import { KitaFormatter } from '@kitajs/generator';
import { KitaParser } from '@kitajs/parser';
import { Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { BaseKitaCommand } from '../util/base';
import Build from './build';

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

  static override flags = {
    ...Build.flags,
    ignore: Flags.directory({
      description: 'Comma separated directories to ignore when watching for changes.',
      multiple: true,
      delimiter: ',',
      char: 'i',
      name: 'ignore',
      exists: true,
      helpGroup: 'watch'
    })
  };

  async run(): Promise<void> {
    this.printSponsor();

    const { flags } = await this.parse(Watch);

    const { config, compilerOptions } = this.parseConfig(flags, {
      declaration: flags.dts,
      watchIgnore: flags.ignore
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
