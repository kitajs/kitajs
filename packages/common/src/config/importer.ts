import { CannotReadConfigError, InvalidConfigError } from '../errors';
import type { KitaConfig } from './model';
import { parseConfig } from './parser';

/** Parses and validates the config. */
export function importConfig(path?: string, root?: string): KitaConfig {
  // No config found, use default
  if (!path) {
    return parseConfig({}, root);
  }

  let config: unknown;

  try {
    config = require(path);
  } catch (error: any) {
    throw new CannotReadConfigError(error?.stack || String(error));
  }

  if (!config) {
    throw new InvalidConfigError('Config file is empty.');
  }

  return parseConfig(config, root);
}
