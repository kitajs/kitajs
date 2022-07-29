import { KitaConfig } from '@kita/core';

/** Global interface that can be overridden to include your own types */
export interface RouteContext {
  config: KitaConfig;
}

/**
 * The context that your code modified the type.
 */
export type ProvidedRouteContext = Omit<RouteContext, 'config'>;
