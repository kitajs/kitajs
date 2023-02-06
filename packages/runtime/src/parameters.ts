import type { FastifySchema } from 'fastify';
import type { Native, ShallowNative } from './types';

/**
 * Path parameters. e.g. `/users/:name/:age`
 *
 * @example
 * ```ts
 * // routes/[name]/[age].ts
 * export function get(
 *  name: Path, // <string, 'name'>
 *  age: Path<number>, // <number, 'age'>
 *  type: Path<string, 'dash-case-name'>,
 * ) {}
 * ```
 */
export type Path<
  Type extends Native = string,
  //@ts-ignore - may not be used / present
  Name extends string = string
> = Type;

/**
 * Requires `@fastify/cookies` to work.
 *
 * @example
 * ```ts
 * export function get(
 *  auth: Cookie, // <'auth', string>
 *  type: Cookie<'custom-name'>, // <'custom-name', string>
 * ) {}
 * ```
 */
//@ts-ignore - may not be used / present
export type Cookie<Name extends string, Type extends Native = string> =
  | string
  | undefined;

/**
 * - Cannot be used with {@link BodyProp}.
 * - Only one Body can be used per route.
 * - GET routes cannot use Body.
 *
 * @example
 * ```ts
 * export function post(
 *  body: Body<{ name: string, age: number }>
 * ) {}
 * ```
 */
export type Body<Obj> = Obj;

/**
 * Cannot be used with {@link Body}
 *
 * @example
 *
 * ```ts
 * export function post(
 *  name:   BodyProp<string>, // <string, 'name'>
 *  age:    BodyProp<number, 'age'>,
 *  types:  BodyProp<string[], 'dash-case-name'>,
 *  parent: BodyProp<User, 'parent'>
 * ) {}
 * ```
 */
//@ts-ignore - may not be used / present
export type BodyProp<Type, Path extends string = string> = Type;

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
  Type extends ShallowNative<Type> = string,
  //@ts-ignore unused
  Name extends Type extends Native | Native[] ? string : 'Cannot use name on complex types' = string
> = Type;

/**
 * Extracted from the request headers. All headers are lowercased.
 *
 * @example
 * export function get(
 *  etag:    Header<'etag'>, // <'etag', string>
 *  age:     Header<'age', number>,
 * ) {}
 */
//@ts-ignore - may not be used / present
// Only one that names comes first because headers are usually kebab-case
export type Header<Name extends Lowercase<string>, Type extends Native = string> = string;

/**
 * The parameter type of the connection.
 *
 * **NOTE**: Only works on `WebSocket` routes.
 *
 * @example
 * export function get(
 *  this: SocketRoute
 *  { socket }: Connection,
 * ) {}
 */
//@ts-ignore - may not be used / present
export type Connection = import('@fastify/websocket').SocketStream;

/**
 * This type allows you to create custom parameters to be used in your routes.
 *
 * @example
 * ```ts
 * // Register this file into your kita config.
 * export type Auth = CustomParameter<{ userId: number }>;
 *
 * export default function Auth(req: FastifyRequest, reply: FastifyReply) {
 *   return { userId: 1 };
 * }
 *
 * // routes/index.ts
 * export function get(auth: Auth) {
 *   auth.userId; // 1
 * }
 * ```
 */
//@ts-ignore - may not be used / present
export type CustomParameter<ReturnType> = ReturnType;
