import { Command, Flags, ux } from '@oclif/core';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

export default class Init extends Command {
  static override description = 'Creates a basic kita.config.js';

  static override examples = [`<%= config.bin %> <%= command.id %>`];

  static override flags = {
    root: Flags.string({ char: 'r', description: 'Root directory of your project' })
  };

  static override args = {};

  async run(): Promise<void> {
    const { flags } = await this.parse(Init);

    this.log(chalk.yellow`Thanks for using Kita! 🎉`);

    const root = flags.root || process.cwd();
    const configPath = path.resolve(root, 'kita.config.js');

    const exists = await fs.stat(configPath).catch(() => false);

    if (exists) {
      this.logToStderr(chalk.red`Config file already exists: ${path.relative(root, configPath)}`);
      this.exit(2);
    }

    ux.action.start('Creating config file');

    await fs.writeFile(configPath, defaultConfig);

    ux.action.stop(chalk.green`Created!`);
  }
}

const defaultConfig = /* ts */ `

// Default kitajs config.
// https://kita.js.org/

/** @type {import('@kitajs/common').KitaConfig} */
module.exports = {
  tsconfig: require.resolve('./tsconfig.json'),
  cwd: __dirname
};

`.trim();
