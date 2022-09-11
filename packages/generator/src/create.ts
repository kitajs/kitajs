import { createConfigExplorer, mergeDefaults, ConfigDefaults } from '@kitajs/core';
import { KitaGenerator } from './generator';
import { findControllerPaths } from './util/paths';
import path from 'node:path';

export async function createKitaGenerator() {
  const cfg = await createConfigExplorer();

  const rootPath = cfg ? path.dirname(cfg.filepath) : process.cwd();
  const config = cfg ? mergeDefaults(cfg.config) : ConfigDefaults;

  const controllersPaths = await findControllerPaths(config.controllers.glob, rootPath);

  return new KitaGenerator(rootPath, config, controllersPaths);
}
