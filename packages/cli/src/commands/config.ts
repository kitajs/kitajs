import { Flags } from '@oclif/core';
import { BaseKitaCommand } from '../util/base';

export default class Config extends BaseKitaCommand {
  static override description = 'Prints the full resolved configuration file';

  static override flags = {
    raw: Flags.boolean({
      char: 'r',
      description: 'Prints a raw JSON string instead of a pretty printed one.',
      default: false
    }),
    'root-names': Flags.boolean({
      char: 'R',
      description: 'Also includes a list of all root filenames.',
      default: false
    })
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Config);
    const { config, compilerOptions } = this.parseConfig(flags, undefined, false);

    //@ts-expect-error - Just to allow the compilerOptions to be printed
    config.compilerOptions = compilerOptions;

    if (!flags['root-names']) {
      //@ts-expect-error - Just to allow the compilerOptions to be pretty printed
      compilerOptions.rootNames = undefined;
    }

    if (flags.raw) {
      this.log(JSON.stringify(config));
    } else {
      this.logJson(config);
    }
  }
}
