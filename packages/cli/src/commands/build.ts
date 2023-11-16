import { KitaFormatter } from '@kitajs/generator';
import { KitaParser } from '@kitajs/parser';
import { Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import { BaseKitaCommand } from '../util/base';

export default class Build extends BaseKitaCommand {
  static override description = 'Analyses your backend searching for routes and bakes it into the runtime.';

  static override examples = [
    {
      command: '<%= config.bin %> <%= command.id %> -c kita.config.js',
      description: 'Builds your backend with a custom config file.'
    },
    {
      command: '<%= config.bin %> <%= command.id %> -d',
      description: 'Fast checks your backend for errors without generating the runtime.'
    }
  ];

  static override flags = {
    'dry-run': Flags.boolean({
      char: 'd',
      description: 'Skips generation process and only type-checks your files.',
      default: false,
      helpGroup: 'build'
    }),
    dts: Flags.boolean({
      char: 'D',
      description: 'Skips emitting declaration files (d.ts).',
      default: true,
      allowNo: true,
      helpGroup: 'build',
      exclusive: ['dry-run']
    }),
    reset: Flags.boolean({
      char: 'r',
      description: 'Removes previous generated files before each build.',
      default: false,
      helpGroup: 'build',
      exclusive: ['dry-run']
    })
  };

  async run(): Promise<void> {
    this.printSponsor();

    const { flags } = await this.parse(Build);

    const { config, compilerOptions } = this.parseConfig(flags, {
      declaration: flags.dts
    });

    ux.action.start('Warming up', '', {
      stdout: true,
      style: 'clock'
    });

    const formatter = flags['dry-run'] ? undefined : new KitaFormatter(config);

    const parser = KitaParser.create(
      config,
      compilerOptions,
      // Prefer already looked up files instead of walking the folder again
      compilerOptions.rootNames,
      // Dry runs should not generate any files
      formatter
    );

    ux.action.stop(chalk`{cyan Ready to build!}`);

    const diagnostics = await this.runParser(parser, formatter, flags.reset, config);

    if (diagnostics.length > 0) {
      this.error(chalk`{red Finished with errors!}`);
    }

    if (parser.getRouteCount() === 0) {
      this.warn(chalk`{yellow No routes were found!}`);
    }

    if (process.stdout.isTTY) {
      if (flags['dry-run']) {
        this.log(chalk`{green \nNo errors were found!}`);
      } else {
        this.log(chalk`{green \nRuntime is ready to use!}`);
      }
    }
  }
}
