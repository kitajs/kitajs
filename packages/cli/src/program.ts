import { catchKitaError, errorCount } from '@kitajs/generator';
import { program } from 'commander';
import { generate } from './generate';

process.on('unhandledRejection', catchKitaError);

program
  .command('generate')
  .description('Generates code for all your controllers')
  .action(() => {
    generate()
      .catch(catchKitaError)
      .then(() => errorCount > 0 && process.exit(1));
  });

program.parse();
