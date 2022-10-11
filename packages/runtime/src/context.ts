import type { KitaConfig } from '@kitajs/generator';
import type { FastifyInstance, RouteShorthandOptions } from 'fastify';

/** Global interface that can be overridden to include your own types */
export interface RouteContext {
  config: KitaConfig;
  fastify: FastifyInstance;
  //@ts-ignore- maybe piscina is not installed
  piscina?: import('piscina');
}

/** The context that your code modified the type. */
export type ProvidedRouteContext = Omit<RouteContext, 'config' | 'fastify'>;

//@ts-expect-error - ignore unused
export type Route<
  OperationId extends string,
  Config extends RouteShorthandOptions = {}
> = RouteContext;

/**
 * Async routes only supports I/O data to be used.
 */
//@ts-expect-error - ignore unused
export type AsyncRoute<
  OperationId extends string,
  Config extends RouteShorthandOptions = {}
> = undefined;
