import {
  errorCount,
  findControllerPaths,
  KitaConfig,
  importConfig,
  KitaGenerator
} from '@kitajs/generator';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import { log } from '../util/log';

export async function generate(options: Record<string, any>) {
  const start = Date.now();

  const cfgPath = process.env.KITA_CONFIG || path.resolve(process.cwd(), options.config);

  if (!cfgPath.match(/\.js$/)) {
    // TODO: Link to docs - configuration files.
    log('❌', 'Kita configuration files must be a commonjs javascript module.');
    return process.exit(1);
  }

  const root = path.dirname(cfgPath);
  const cfg: KitaConfig = importConfig(cfgPath);

  const controllersPaths = await findControllerPaths(cfg.controllers.glob, root);
  const kita = new (cfg.customGenerator || KitaGenerator)(root, cfg, controllersPaths);

  log('🔬', 'Introspecting code...');

  await kita.updateAst();

  const schemas = chalk.yellowBright(kita.ast.schemas.length);
  const routes = chalk.yellowBright(kita.ast.routes.length);
  const errors = (errorCount === 0 ? chalk.greenBright : chalk.red)(errorCount);
  log('🗃️', `Read ${schemas} schemas, ${routes} routes and threw ${errors} errors.`);

  let code = await kita.astToString();

  if (cfg.routes.format) {
    try {
      code = prettier.format(code, cfg.routes.format);
    } catch (err) {
      log(
        '❌',
        'Prettier could not format the output file. Maybe it has an invalid syntax?',
        err
      );
    }
  }

  const local = `./${path.relative(process.cwd(), kita.outputPath)}`;
  log('🖨️', `Exporting code to ${chalk.yellowBright(local)}`);

  await fs.writeFile(kita.outputPath, code);

  const elapsed = (Date.now() - start) / 1000;
  log('✅', `Took ${chalk.cyanBright(elapsed.toFixed(2))} seconds`);

  if (errorCount > 0) {
    process.exit(1);
  }

  return;
}
