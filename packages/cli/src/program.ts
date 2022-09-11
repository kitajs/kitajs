import { program } from 'commander';
import { generate } from './generate';
import { catchKitaError } from '@kitajs/generator';

program
  .command('generate')
  .description('Generates code for all your controllers')
  .action(() => {
    generate().catch((err) => {
      catchKitaError(err);
      process.exit(1);
    });
  });

program.parse();
