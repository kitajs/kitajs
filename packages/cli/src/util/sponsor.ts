import type { Command } from '@oclif/core';
import chalk from 'chalk';

export function printSponsor(cmd: Command) {
  if (!process.stdout.isTTY) {
    return;
  }

  if (
    // defined environments should not show the message
    process.env.NODE_ENV !== 'production' &&
    // 50% chance of showing the sponsor message
    Math.random() < 0.5
  ) {
    cmd.log(chalk`{grey   Please support my open source work! ❤️  \nhttps://github.com/sponsors/arthurfiorette\n}`);
  }

  // terminal may not be 256 color compatible
  cmd.log(chalk`You're using {${chalk.level > 1 ? `hex('#b58d88')` : 'yellow'} Kita}! 🎉\n`);
}
