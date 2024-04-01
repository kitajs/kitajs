import type { Primitive } from 'type-fest';

/**
 * Path parameters. e.g. `/users/:name/:age`
 *
 * @example
 *
 * ```ts
 * // routes/[name]/[age].ts
 * export function get(
 *   name: Path, // <string, 'name'>
 *   age: Path<number>, // <number, 'age'>
 *   type: Path<string, 'dash-case-name'>
 * ) {}
 * ```
 *
 * @link https://kita.js.org/parameters/path
 */
export type Path<Type extends Primitive = string, _Name extends string = string> = Type;
