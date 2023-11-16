import { ux } from '@oclif/core';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { BaseKitaCommand } from '../util/base';

export default class Init extends BaseKitaCommand {
  static override description = 'Creates a basic kita.config.js';

  static override examples = ['<%= config.bin %> <%= command.id %>'];

  async run(): Promise<void> {
    this.printSponsor();

    const { flags } = await this.parse(Init);

    const configPath = path.resolve(flags.cwd || process.cwd(), 'kita.config.js');

    const exists = fs.existsSync(configPath);

    if (exists) {
      this.error(chalk`{red File already exists: ${path.relative(process.cwd(), configPath)}}`);
    }

    ux.action.start('Creating config file');

    fs.writeFileSync(configPath, defaultConfig);

    ux.action.stop(chalk`{green Created!}`);

    this.warn(chalk`{yellow Kita's defaults are often the option configuration, be careful with what you change.}`);
  }
}

const defaultConfig = `

// Documentation: https://kita.js.org

/** @type {import('@kitajs/cli').KitaConfig} */
module.exports = {
  /* You are fine with the defaults XD, feel free to delete this config file. */
};

`.trim();
