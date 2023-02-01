import { ts } from 'ts-json-schema-generator';
import { KitaError } from '../errors';
import path from 'path';

export function readCompilerOptions(tsconfigPath: string) {
  const { config, error } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  if (error) {
    throw KitaError(`Failed to read tsconfig file.`, tsconfigPath, { info: error });
  }

  const { options, errors } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    path.dirname(tsconfigPath),
    undefined,
    tsconfigPath
  );

  if (errors.length) {
    throw KitaError(`Failed to parse tsconfig file.`, tsconfigPath, { info: errors });
  }

  return options;
}
