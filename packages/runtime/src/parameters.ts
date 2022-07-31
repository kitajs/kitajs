import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Native } from './types';
import type { KitaCpp } from './internal';

//@ts-ignore unused
export type Path<Name extends string = string> = string;

//@ts-ignore unused
export type Cookie<Name extends String> = string | number | boolean | undefined;

export type Body<Obj> = Obj;

//@ts-ignore unused
export type BodyProp<T, Path extends string = string> = T;

//@ts-ignore unused
export type Query<NameOrType = string> = NameOrType extends string ? string : NameOrType;

//@ts-ignore unused
export type Header<Name extends String> = string;

/** The Fastify request type */
export type Req = FastifyRequest;

/** The Fastify reply type */
export type Rep = FastifyReply;

/** A custom parameter type. */
export type CustomParameter<Result, Parameters extends Native[]> = Result & {
  /**
   * **THIS TYPE IS NOT AVAILABLE AT RUNTIME. IGNORE IT**
   *
   * @internal
   */
  [KitaCpp]: Parameters;
};
