import type { Primitive } from 'type-fest';

/**
 * ### Requires `@fastify/cookies` to work.
 *
 * @example
 *
 * ```ts
 * export function get(
 *   auth: Cookie, // <'auth', string>
 *   type: Cookie<'custom-name'> // <'custom-name', string>
 * ) {}
 * ```
 *
 * @link https://kita.js.org/parameters/cookie
 */
export type Cookie<_Name extends string = string, _Type extends Primitive = string> = string;
