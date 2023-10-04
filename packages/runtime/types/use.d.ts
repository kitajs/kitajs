import type { RouteShorthandOptions } from 'fastify';

/**
 * @example
 *
 * ```ts
 * export function get() {}
 *
 * export const myExportedProperty: RouteShorthandOptions = {...}
 * ```
 */
export type Route<_Config extends RouteShorthandOptions = {}> = void;

/**
 * Applies on or more configurations to a route.
 *
 * @example
 *
 * ```ts
 * export function get(this: Use<typeof customize>) {}
 * export function get(this: Use<[typeof customize, ...]>) {}
 *
 * // Adds  a preHandler to the route
 * export function customize(route: RouteShorthandOptions) {
 *  route.preHandler ??= []
 *  route.preHandler.push(myHandler
 *  return route;
 * }
 * ```
 */
export type Use<_Config extends RouteMapper | RouteMapper[]> = void;

/**
 * A RouteMapper is a function that takes a RouteShorthandOptions and returns a RouteShorthandOptions. It is used to
 * modify the route configuration.
 */
export type RouteMapper = (config: RouteShorthandOptions) => RouteShorthandOptions;
