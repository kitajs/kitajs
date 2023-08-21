import { errorCount, findControllerPaths, importConfig, KitaConfig, KitaGenerator } from '@kitajs/generator';
import path from 'path';

export async function output(options: Record<string, any>) {
  const cfgPath = process.env.KITA_CONFIG || path.resolve(process.cwd(), options.config);

  if (!cfgPath.match(/\.js$/)) {
    console.error('Kita does not support typescript config files yet. Please use a javascript config file.');

    process.exit(1);
  }

  const root = path.dirname(cfgPath);
  const cfg: KitaConfig = importConfig(cfgPath);

  const controllersPaths = await findControllerPaths(cfg.controllers.glob, root);
  const kita = new KitaGenerator(root, cfg, controllersPaths);

  console.log(kita.outputPath);

  if (errorCount > 0) {
    process.exit(1);
  }
}
