import deepmerge from "deepmerge";
import { CannotReadConfigError, InvalidConfigError } from "../errors";
import { DefaultConfig } from "./defaults";
import { KitaConfig } from "./model";
import { PartialDeep } from "type-fest";


/**
 * Tries to import a config file from the given path.
 */
export function importConfig(path: string) {
  try {
    return mergeDefaults(require(path));
  } catch (e: any) {
    // The provided path is not a valid config file
    if (
      e.code === 'MODULE_NOT_FOUND' &&
      e.message.includes(`Cannot find module '${path}'`)
    ) {
      return DefaultConfig;
    }

    throw new CannotReadConfigError(e.message);
  }
}

export function mergeDefaults(config: PartialDeep<KitaConfig> = {}) {
  if (config?.controllers?.glob && !Array.isArray(config.controllers.glob)) {
    throw new InvalidConfigError('controllers.glob must be an array of strings', config);
  }

  // Removes additionalProperties property from schemas if this is the default value
  if (config.schema?.generator && config.schema.generator.additionalProperties !== false) {
    config.schema.generator.additionalProperties = undefined;
  }

  return deepmerge<KitaConfig>(
    DefaultConfig,
    // Validated config
    config as KitaConfig,
    { arrayMerge: (_, b) => b }
  );
}
