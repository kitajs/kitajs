import type { Primitive } from 'type-fest';

/**
 * Extracted from the request headers. All headers are lowercased.
 *
 * @example
 *
 * ```ts
 * export function get(
 *   etag: Header<'etag'>, // <'etag', string>
 *   age: Header<'age', number>
 * ) {}
 * ```
 *
 * @link https://kita.js.org/parameters/header
 */
export type Header<_Name extends Lowercase<string> = Lowercase<string>, _Type extends Primitive = string> = string;
