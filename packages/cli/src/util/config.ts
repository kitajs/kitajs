import { KitaConfig, parseConfig } from '@kitajs/common';
import fs from 'fs';
import path from 'path';

export async function readConfig(
  root: string,
  error: (msg: string) => never,
  configPath?: string
): Promise<KitaConfig> {
  // Tries to lookup for a default config file
  const defaultConfigPath = path.resolve(root, 'kita.config.js');

  if (configPath) {
    configPath = path.resolve(root, configPath);
  } else if (await fs.promises.stat(defaultConfigPath).catch(() => false)) {
    configPath = defaultConfigPath;
  }
  if (!configPath) {
    return parseConfig(undefined, root);
  }

  const exists = await fs.promises.stat(configPath).catch(() => false);

  if (!exists) {
    error(`Config file does not exist: ${configPath}`);
  }

  const cfg = require(configPath);

  if (typeof cfg !== 'object') {
    error(`Config file must export an object.`);
  }

  // Esm
  if (typeof cfg.default === 'object') {
    return parseConfig(cfg.default, root);
  }

  return parseConfig(cfg, root);
}
