import { BaseKitaCommand } from '../util/base';
import { printSponsor } from '../util/sponsor';

export default class Reset extends BaseKitaCommand {
  static override description = 'Resets your runtime in an attempt to fix any issues.';

  static override examples = [
    {
      command: '<%= config.bin %> <%= command.id %>',
      description: 'Resets your runtime'
    }
  ];

  async run(): Promise<void> {
    printSponsor(this);

    const { flags } = await this.parse(Reset);
    const { config } = this.parseConfig(flags);

    await this.resetRuntime(config);
  }
}
