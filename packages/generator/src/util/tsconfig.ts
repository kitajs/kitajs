import ts from 'typescript';

export function readTsconfig(path: string) {
  const { config, error } = ts.readConfigFile(path, ts.sys.readFile);

  if (error) {
    const error = new Error(`Failed to read tsconfig file: ${path}`);

    //@ts-expect-error - TODO: better error handling
    error.info = error;

    throw error;
  }

  return config;
}
