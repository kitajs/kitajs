import type { FastifyReply, FastifyRequest } from 'fastify'

//@ts-ignore unused
export type Path<Name extends string> = string;
//@ts-ignore unused
export type Cookie<Name extends String> = string | number | boolean;
export type Body<Obj> = Obj;
//@ts-ignore unused
export type BodyProp<T, Path extends string> = T;
//@ts-ignore unused
export type Query<Name extends string | true = true> = string;
//@ts-ignore unused
export type Header<Name extends String> = string;
export type Req = FastifyRequest;
export type Reply = FastifyReply;

declare global {
  /** Global interface that can be overridden to include your own types */
  export interface KitaContext {}
}