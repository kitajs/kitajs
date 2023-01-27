import { ts } from 'ts-json-schema-generator';
import { KitaError } from '../errors';
import path from 'path';

export function readCompilerOptions(tsconfigPath: string) {
  const { config, error } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  if (error) {
    throw KitaError(`Failed to read tsconfig file.`, tsconfigPath, { info: error });
  }

  config.compilerOptions ??= {};
  const { dir, base } = path.parse(tsconfigPath);

  const { options, errors } = ts.convertCompilerOptionsFromJson(
    config.compilerOptions,
    dir,
    base
  );

  if (errors.length) {
    throw KitaError(`Failed to parse tsconfig file.`, tsconfigPath, { info: errors });
  }

  return options;
}
