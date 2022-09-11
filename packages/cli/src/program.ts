import { program } from 'commander';
import { generate } from './generate';
import { catchKitaError } from '@kitajs/generator';

program
  .command('generate')
  .description('Generates code for all your controllers')
  .action(() => {
    generate().catch(catchKitaError);
  });

program.parse();
