import { ts } from '@kitajs/ts-json-schema-generator';
import { KitaError } from '../errors';

export function readTsconfig(path: string) {
  const { config, error } = ts.readConfigFile(path, ts.sys.readFile);

  if (error) {
    throw KitaError(`Failed to read tsconfig file.`, path, { info: error });
  }

  return config;
}
