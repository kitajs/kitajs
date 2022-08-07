import type { KitaConfig } from '@kita/core';
import type { FastifyInstance, RouteShorthandOptions } from 'fastify';

/** Global interface that can be overridden to include your own types */
export interface RouteContext {
  config: KitaConfig;
  fastify: FastifyInstance;
}

/** The context that your code modified the type. */
export type ProvidedRouteContext = Omit<RouteContext, 'config' | 'fastify'>;

//@ts-expect-error - ignore unused
export type Route<
  OperationId extends string,
  Config extends RouteShorthandOptions = {}
> = RouteContext;
