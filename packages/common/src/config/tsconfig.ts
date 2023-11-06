import path from 'node:path';
import ts from 'typescript';
import { CannotParseTsconfigError, CannotReadTsconfigError } from '../errors/config';

export function readCompilerOptions(tsconfigPath: string): ts.CompilerOptions & { rootNames: string[] } {
  const { config, error } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

  if (error) {
    throw new CannotReadTsconfigError(tsconfigPath, error);
  }

  const { options, errors, fileNames } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    path.dirname(tsconfigPath),
    undefined,
    tsconfigPath
  );

  if (errors.length) {
    throw new CannotParseTsconfigError(tsconfigPath, errors);
  }

  return {
    ...options,
    rootNames: fileNames
  };
}
