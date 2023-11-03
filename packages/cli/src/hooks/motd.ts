import { Hook } from '@oclif/core';
import chalk from 'chalk';

const hook: Hook<'init'> = async function (options) {
  if (['-v', 'version', '-h', 'help'].includes(options.id!)) {
    return;
  }

  if (process.stdout.isTTY) {
    this.log(chalk.yellow`Thanks for using Kita! 🎉`);
    this.log(chalk.grey`Please support my work at https://github.com/sponsors/arthurfiorette ❤️\n`);
  }
};

export default hook;
