declare global {
  /**
   * This variable is required to be defined before any routes are imported. It should be the dirname of your source
   * files, usually the `src` or `dist` folder.
   *
   * @example
   *
   * ```ts
   * // CommonsJS example
   * globalThis.KITA_PROJECT_ROOT = __dirname;
   *
   * // ES Modules example
   * import { dirname } from 'path';
   * import { fileURLToPath } from 'url';
   * globalThis.KITA_PROJECT_ROOT = dirname(fileURLToPath(import.meta.url));
   *
   * // The rest of your js code
   * import { Kita } from '@kitajs/runtime';
   * import fastify from 'fastify';
   *
   * fastify()
   *   .register(Kita)
   *   .listen(3000)
   *   // Sample of your fastify main file
   *   .then(console.log, console.error);
   * ```
   *
   * @link https://kita.js.org/concepts/routing#kita-project-root
   */
  var KITA_PROJECT_ROOT: string;
}

export type {};
