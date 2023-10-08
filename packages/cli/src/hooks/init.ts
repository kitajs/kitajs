import { Hook } from '@oclif/core';
import chalk from 'chalk';

const hook: Hook<'init'> = async function () {
  this.log(chalk.yellow`Thanks for using Kita! 🎉`);
};

export default hook;
