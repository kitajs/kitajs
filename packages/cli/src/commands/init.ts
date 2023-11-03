import { Command, Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

export default class Init extends Command {
  static override description = 'Creates a basic kita.config.js';

  static override examples = [`<%= config.bin %> <%= command.id %>`];

  static override flags = {
    root: Flags.string({
      char: 'r',
      description: 'Custom root directory for your project.'
    })
  };

  static override args = {};

  async run(): Promise<void> {
    const { flags } = await this.parse(Init);

    this.log(chalk.yellow`Thanks for using Kita! 🎉\n`);

    const root = flags.root || process.cwd();
    const configPath = path.resolve(root, 'kita.config.js');

    const exists = await fs.stat(configPath).catch(() => false);

    if (exists) {
      this.error(chalk.red`File already exists: ${path.relative(process.cwd(), configPath)}`);
    }

    ux.action.start('Creating config file');

    await fs.writeFile(configPath, defaultConfig);

    ux.action.stop(chalk.green`Created!`);

    this.warn(chalk.yellow`Using a external config file is not recommended and you should stick to defaults!`);
  }
}

const defaultConfig = `

// Documentation: https://kita.js.org/

/** @type {import('@kitajs/cli').KitaConfig} */
module.exports = {
  /* You are fine with the defaults, feel free to delete this config file. */
};

`.trim();
