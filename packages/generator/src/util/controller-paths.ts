import { promise as glob } from 'glob-promise';

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
