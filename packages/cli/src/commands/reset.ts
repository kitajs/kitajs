import { ux } from '@oclif/core';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { BaseKitaCommand } from '../util/base';

export default class Reset extends BaseKitaCommand {
  static override description = 'Resets your runtime in an attempt to fix any issues.';

  static override examples = [
    {
      command: `<%= config.bin %> <%= command.id %> -c kita.config.js`,
      description: 'Builds your backend with a custom config file.'
    }
  ];

  async run(): Promise<void> {
    this.printSponsor();

    const { flags } = await this.parse(Reset);
    const { config } = this.parseConfig(flags, { declaration: flags.types });

    ux.action.start('Clearing runtime', '', {
      stdout: true,
      style: 'clock'
    });

    fs.rmSync(config.runtimePath, {
      recursive: true
    });

    fs.cpSync(path.resolve(__dirname, '../../runtime'), config.runtimePath, {
      recursive: true
    });

    ux.action.stop(chalk.yellow(`.${path.sep}${path.relative(config.cwd, config.runtimePath)}`));
  }
}
