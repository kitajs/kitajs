import type { Primitive } from 'type-fest';

/**
 * Path parameters. e.g. `/users/:name/:age`
 *
 * It does not support path parameters with dashes like `/users/:my-name`.
 *
 * @example
 *
 * ```ts
 * // routes/[name]/[age].ts
 * export function get(
 *   name: Path, // <string, 'name'>
 *   age: Path<number>, // <number, 'age'>
 *   type: Path<string, 'customName'>
 * ) {}
 * ```
 *
 * @link https://kita.js.org/parameters/path
 */
export type Path<Type extends Primitive = string, _Name extends string = string> = Type;
