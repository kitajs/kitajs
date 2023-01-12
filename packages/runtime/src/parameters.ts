import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Native } from './types';

//@ts-ignore unused
export type Path<Name extends string = string> = string;

/** **The usage of this parameter requires `@fastify/cookies` set up!** */
//@ts-ignore unused
export type Cookie<Name> = string | undefined;

/** Cannot be used with BodyProp */
export type Body<Obj> = Obj;

//@ts-ignore unused
export type BodyProp<Type, Path extends string = string> = Type;

/**
 * @example
 * ```ts
 * export function get(
 *   name: Query, // defaults to string
 *   age: Query<number>, // custom type
 *   ageString: Query<'age'>, // custom name
 *   customNamed: Query<boolean, 'custom-naming'>, // Custom type and name
 *
 *   // If this mode is used, it **MUST BE THE ONLY** query parameter
 *   extended: Query<Extended>, // custom type. (not string | number | boolean)
 * ) {}
 * ```
 */
//@ts-ignore unused
export type Query<
  Type = string,
  //@ts-ignore unused
  Name extends Type extends string
    ? "Name must be the second parameter. For string type values, use Query<'name'> instead."
    : string = Type extends string
    ? "Name must be the second parameter. For string type values, use Query<'name'> instead."
    : string
> = Type extends string ? string : Type;

/**
 * **Headers are case insensitive!**
 *
 * @example
 * export function get(
 *   date: Header, // Date header
 *   cacheControl: Header<'Cache-Control'>, // Custom name
 * ) {}
 */
//@ts-ignore unused
export type Header<Name extends String> = string;

/**
 * The Fastify request type
 *
 * @example
 * export function get(
 *  req: Req,
 * ) {
 *   const myHeader = req.headers['my-header'];
 * }
 */
export type Req = FastifyRequest;

/**
 * The Fastify reply type
 *
 * @example
 * export function get(
 *  rep: Rep,
 * ) {
 *   rep.setHeader('my-header', 123)
 * }
 */
export type Rep = Omit<FastifyReply, 'send'>;

/**
 * A custom parameter that will resolve to whatever the configuration sets it to.
 *
 * @example
 * // my parameter file
 *
 * export type MyParameter = CustomParameter<string> // string return type
 *
 * export default function (
 *   this: RouteContext,
 *   _req: Req,
 *   _rep: Rep,
 * ) {}
 *
 * // my parameter with config file
 *
 * // applied in the generics order
 * export type MyParameterWithConfig<A extends number, B extends number> = CustomParameter<{ sum: number }, [A, B]>;
 *
 * export default function (
 *   this: RouteContext,
 *   _req: Req,
 *   _rep: Rep,
 *   a: number,
 *   b: number
 * ) {
 *  return { sum: a + b };
 * }
 *
 * // routes file
 *
 * export function get(
 *   param: MyParameter,
 *   param2: MyParameterWithConfig<1, 2>
 * ) {}
 *
 * // in the kita.config.js
 *
 * const path = require('path');
 *
 * module.exports = {
 *   params: {
 *    MyParameter: path.resolve(__dirname, 'path to resolver'),
 *    MyParameterWithConfig: path.resolve(__dirname, 'path to resolver'),
 *  },
 * };
 */
//@ts-ignore unused
export type CustomParameter<Result, Parameters extends Native[] = []> = Result;

/**
 * The parameter type of the connection.
 *
 * **NOTE**: Only works on `WebSocket` routes.
 *
 * @example
 * export function ws(
 *   this: Route<'subscribeUsers'>,
 *   conn: Conn,
 *   req: Req,
 * ) {}
 */
//@ts-ignore - may not be used / present
export type Conn = import('@fastify/websocket').SocketStream;
