// import glob from 'glob-promise';
import path from 'node:path';
import type { KitaGenerator } from '../generator';

export function findControllerPaths(controllerGlobs: string[], cwd: string) {
  return [];
}

export function importablePath(
  { outputFolder, rootPath }: Pick<KitaGenerator, 'outputFolder' | 'rootPath'>,
  filepath: string
) {
  return `./${path.relative(
    outputFolder,
    path.resolve(
      rootPath,
      // remove possible .ts extension
      filepath.replace(/\.ts$/, '')
    )
  )}`;
}
