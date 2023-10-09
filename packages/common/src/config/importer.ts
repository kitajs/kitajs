import { CannotReadConfigError, InvalidConfigError } from '../errors';
import { KitaConfig } from './model';
import { parseConfig } from './parser';

/** Parses and validates the config. */
export function importConfig(path?: string): KitaConfig {
  // No config found, use default
  if (!path) {
    return parseConfig();
  }

  let config;

  try {
    config = require(path);
  } catch (error: any) {
    throw new CannotReadConfigError(error?.stack || String(error));
  }

  if (!config) {
    throw new InvalidConfigError('Config file is empty.');
  }

  return parseConfig(config);
}
