import  type { Primitive } from 'type-fest';

/**
 * Extracted from query url. e.g. `?name=John&age=20`
 *
 * @example
 * ```
 * export function get(
 *  name: Query, // <string, 'name'>
 *  age:  Query<number>, // <number, 'age'>
 *  type: Query<string, 'dash-case-name'>,
 *
 *  // If this mode is used, it **MUST BE THE ONLY** Query in use.
 *  { a, b }: Query<MyQuery>,
 * ) {}
 * ```
 */
export type Query<
  Type extends Primitive | Primitive[] | Record<string, Primitive> = string,
  _Name extends Type extends Primitive | Primitive[] ? string : 'Cannot use name on complex types' = any
> = Type;
