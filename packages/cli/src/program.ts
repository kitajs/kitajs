import { program } from 'commander';
import { generate } from './cli/generate';
import { output } from './cli/output';
import { run } from './cli/run';
const { version } = require('../package.json');

// process.on('unhandledRejection', catchKitaError);

program
  .name('kita')
  .version(version)
  .description('The CLI tool for generating Kita typescript code.');

program
  .command('generate')
  .description('Generates code for all your controllers')
  .option('-c, --config <path>', 'The path to the config file', 'kita.config.js')
  .action(generate);

program
  .command('output')
  .description('Prints out the path to the generated routes file')
  .option('-c, --config <path>', 'The path to the config file', 'kita.config.js')
  .action(output);

program
  .command('run')
  .description('Generate v2')
  .option('-c, --config <path>', 'The path to the config file', 'kita.config.js')
  .action(run);

program.parse();
