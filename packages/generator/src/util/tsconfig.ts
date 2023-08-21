import path from 'path';
import ts from 'typescript';
import { CannotParseTsconfigError, CannotReadTsconfigError } from '../errors';

export function readCompilerOptions(tsconfigPath: string) {
  const { config, error } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  if (error) {
    throw new CannotReadTsconfigError(tsconfigPath, error);
  }

  const { options, errors } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    path.dirname(tsconfigPath),
    undefined,
    tsconfigPath
  );

  if (errors.length) {
    throw new CannotParseTsconfigError(tsconfigPath, errors);
  }

  return options;
}
