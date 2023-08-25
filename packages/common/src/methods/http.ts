import type { HTTPMethods, RouteShorthandOptions } from 'fastify';

/**
 * Mark this route as a HTTP GET handler.
 *
 * @example
 * ```ts
 * export function myOperationId(this: GetRoute) {}
 * ```
 */
export type GetRoute<_Config extends RouteShorthandOptions = {}> = void;

/**
 * Mark this route as a HTTP POST handler.
 *
 * @example
 * ```ts
 * export function myOperationId(this: PostRoute) {}
 * ```
 */
export type PostRoute<_Config extends RouteShorthandOptions = {}> = void;

/**
 * Mark this route as a HTTP DELETE handler.
 *
 * @example
 * ```ts
 * export function myOperationId(this: DeleteRoute) {}
 * ```
 */
export type DeleteRoute<_Config extends RouteShorthandOptions = {}> = void;

/**
 * Mark this route as a HTTP PUT handler.
 *
 * @example
 * ```ts
 * export function myOperationId(this: PutRoute) {}
 * ```
 */
export type PutRoute<_Config extends RouteShorthandOptions = {}> = void;

/**
 * Mark this route as a HTTP handler for all methods.
 *
 * @example
 * ```ts
 * export function myOperationId(this: AllRoute) {}
 * ```
 */
export type AllRoute<_Config extends RouteShorthandOptions = {}> = void;

/**
 * Mark this route as any other HTTP handler.
 *
 * @example
 * ```ts
 * export function myOperationId(this: HttpRoute<'options'>) {}
 * 
 * export function myOtherOperationId(this: HttpRoute<['options', 'put']>) {}
 * ```
 */
export type HttpRoute<_Method extends HTTPMethods | HTTPMethods[], _Config extends RouteShorthandOptions = {}> = void;
