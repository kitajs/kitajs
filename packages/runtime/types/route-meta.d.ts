import { Route } from '@kitajs/common';

/**
 * Returns all gathered route metadata at the generation step. This may be used to provide some reflection capabilities
 * to other libraries or integrations.
 *
 * @example
 *
 * ```ts
 * // providers/logger.ts
 * export default function (meta: RouteMeta): Logger {
 *   return (message) => console.log(`${meta.method} ${meta.url} ${message}`);
 * }
 *
 * // routes/index.ts
 * export function get(logger: Logger) {
 *   logger('Hello World!');
 *   //> GET / Hello World!;
 * }
 * ```
 */
export type RouteMeta = Route;
