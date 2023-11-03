import { KitaConfig, parseConfig } from '@kitajs/common';
import { ux } from '@oclif/core';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export function readConfig(
  root: string,
  error: (msg: string) => never,
  configPath?: string,
  actions?: boolean
): KitaConfig {
  // Tries to lookup for a default config file
  const defaultConfigPath = path.resolve(root, 'kita.config.js');

  if (configPath) {
    configPath = path.resolve(root, configPath);
  } else if (fs.existsSync(defaultConfigPath)) {
    configPath = defaultConfigPath;
  }

  if (!configPath) {
    return parseConfig(undefined, root);
  }

  if (actions) {
    ux.action.start('Reading config', '', { stdout: true, style: 'clock' });
  }

  const exists = fs.existsSync(configPath);

  if (!exists) {
    error(`Config file does not exist: ${configPath}`);
  }

  const cfg = require(configPath);

  if (typeof cfg !== 'object') {
    error(`Config file must export an object.`);
  }

  const config =
    // ESM Module support
    parseConfig(typeof cfg.default === 'object' ? cfg.default : cfg, root);

  if (actions) {
    ux.action.stop(chalk.cyan(`.${path.sep}${path.relative(root, configPath)}`));
  }

  return config;
}
