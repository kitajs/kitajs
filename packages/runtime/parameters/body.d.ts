/**
 * - Cannot be used with {@linkcode BodyProp}.
 * - Only one Body can be used per route.
 * - GET routes cannot use Body.
 *
 * @example
 *
 * ```ts
 * export function post(
 *   body: Body<{ name: string; age: number }>,
 *   body: Body<MyType> // reference works!
 * ) {}
 * ```
 *
 * @link https://kita.js.org/parameters/body
 */
export type Body<Obj> = Obj;

/**
 * - Cannot be used with {@linkcode Body}
 * - GET routes cannot use Body.
 *
 * @example
 *
 * ```ts
 * export function post(
 *   name: BodyProp<string>, // <string, 'name'>
 *   age: BodyProp<number, 'age'>,
 *   types: BodyProp<string[], 'dash-case-name'>,
 *   parent: BodyProp<User, 'parent'>
 * ) {}
 * ```
 *
 * @link https://kita.js.org/parameters/body#using-bodyprop
 */
export type BodyProp<Type, _Path extends string = string> = Type;
