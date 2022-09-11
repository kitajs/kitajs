import glob from 'glob-promise';
import path from 'node:path';
import type { KitaGenerator } from '../generator';

export function findControllerPaths(controllerGlobs: string[], cwd: string) {
  return (
    Promise
      // Uses glob-promise to avoid callback hell
      .all(controllerGlobs.map((cg) => glob(cg, { cwd })))
      // Flat all the results
      .then((r) => r.flat())
      // Remove duplicates
      .then((r) => r.filter((value, index, self) => self.indexOf(value) === index))
  );
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
