import { catchKitaError } from '@kitajs/generator';
import { program } from 'commander';
import { generate } from './cli/generate';
import { output } from './cli/output';
const { version } = require('../package.json');

process.on('unhandledRejection', catchKitaError);

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

program.parse();

// import { createKitaGenerator } from '@kitajs/generator';
// import { KitaGenerator } from '@kitajs/generator';
// import { catchKitaError, errorCount } from '@kitajs/generator';
// import { KitaConfig } from '@kitajs/generator';
// import { KitaGenerator } from '@kitajs/generator';
// import { findControllerPaths } from '@kitajs/generator';
// import { path } from 'node:path';

// export async function generate(opts: { [key: string]: any }) {
//   const config = await loadConfig(opts.config);

//   const rootPath = config ? path.dirname(config.filepath) : process.cwd();
//   const cfg = config ? mergeDefaults(config.config) : ConfigDefaults;

//   const controllersPaths = await findControllerPaths(cfg.controllers.glob, rootPath);

//   const kita = new KitaGenerator(rootPath, cfg, controllersPaths);

//   if (opts.onReady) {
//     opts.onReady(kita);
//   }

//   if (opts.watch) {
//     const watcher = chokidar.watch(cfg.controllers.glob, {
//       cwd: rootPath,
//       ignoreInitial: true
//     });

//     watcher.on('ready', () => {
//       console.log('Watching for changes...');
//     });

//     watcher.on('all', async (event, path) => {
//       console.log(`Detected change to ${path}, regenerating...`);

//       const controllersPaths = await findControllerPaths(cfg.controllers.glob, rootPath);
//       kita.updateControllers(controllersPaths);

//       await kita.generate();
//     });
//   } else {
//     await kita.generate();
//   }
// }
