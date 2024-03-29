import { Flags } from '@oclif/core';
import { inspect } from 'util';
import { BaseKitaCommand } from '../util/base';
import { printSponsor } from '../util/sponsor';

export default class Config extends BaseKitaCommand {
  static override description = 'Prints the full resolved configuration file';

  static override examples = [
    {
      command: '<%= config.bin %> <%= command.id %> -c kita.config.js',
      description: 'Builds your backend with a custom config file.'
    }
  ];

  static override flags = {
    raw: Flags.boolean({
      char: 'r',
      description: 'Prints a JSON string instead of a pretty printed object.',
      default: false,
      allowNo: true
    })
  };

  async run(): Promise<void> {
    printSponsor(this);

    const { flags } = await this.parse(Config);
    const { config, compilerOptions } = this.parseConfig(flags, undefined, false);

    //@ts-expect-error - Just to allow the compilerOptions to be printed
    config.compilerOptions = compilerOptions;
    //@ts-expect-error - Just to allow the compilerOptions to be pretty printed
    compilerOptions.rootNames = undefined;

    if (flags.raw || !process.stdout.isTTY) {
      this.log(JSON.stringify(config, null, 2));
    } else {
      this.log(
        inspect(config, {
          colors: true,
          depth: Infinity,
          maxArrayLength: Infinity,
          maxStringLength: Infinity
        })
      );
    }
  }
}
