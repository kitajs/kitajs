import type { RouteShorthandOptions } from 'fastify';

/**
 * Simply an GET request with a pre defined `Content-Type: text/html` response.
 * This route will also be ignored by the swagger documentation.
 *
 * @example
 * ```ts
 * export function myOperationId(this: HtmlRoute) {
 *   return '<h1>Hello World</h1>';
 * }
 * ```
 */
export type HtmlRoute<_Config extends RouteShorthandOptions = {}> = void;
