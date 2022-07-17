import { program } from 'commander';
import { generate } from './generate';

program
  .command('generate')
  .description('Generates code for all your controllers')
  .action(generate);

program.parse();
