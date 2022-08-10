import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Native } from './types';

//@ts-ignore unused
export type Path<Name extends string = string> = string;

//@ts-ignore unused
export type Cookie<Name extends String> = string | number | boolean | undefined;

export type Body<Obj> = Obj;

//@ts-ignore unused
export type BodyProp<Type, Path extends string = string> = Type;

/**
 * @example
 * ```ts
 * export function get(
 *   name: Query, // defaults to string
 *   age: Query<number>, // custom type
 *   { a, b }: Query<Extended>, // custom type `{ a: number; b: number }`;
 *   _: Query<boolean, 'custom-naming'> // Name comes from splicit parameter
 * ) {}
 * ```
 */
//@ts-ignore unused
export type Query<Type = string, Name = string> = Type extends string ? string : Type;

/**
 * @example
 * ```ts
 * export function get(
 *   date: Header, // Date header (case insensitive)
 *   cacheControl: Header<'Cache-Control'>, // Custom name (case insensitive)
 * ) {}
 * ```
 */
//@ts-ignore unused
export type Header<Name extends String> = string;

/** The Fastify request type */
export type Req = FastifyRequest;

/** The Fastify reply type */
export type Rep = FastifyReply;

/** A custom parameter type. */
//@ts-ignore unused
export type CustomParameter<Result, Parameters extends Native[]> = Result;
