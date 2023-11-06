import { BaseKitaCommand } from '../util/base';

export default class Reset extends BaseKitaCommand {
  static override description = 'Resets your runtime in an attempt to fix any issues.';

  static override examples = [
    {
      command: `<%= config.bin %> <%= command.id %> -c kita.config.js`,
      description: 'Builds your backend with a custom config file.'
    }
  ];

  static override aliases = ['r'];

  async run(): Promise<void> {
    this.printSponsor();

    const { flags } = await this.parse(Reset);
    const { config } = this.parseConfig(flags);

    await this.resetRuntime(config);
  }
}
