import { KitaConfig } from '@kita/core';
import { RuntimeConfig } from './config';

/** Global interface that can be overridden to include your own types */
export interface RouteContext {
  kita: RuntimeConfig;
  config: KitaConfig;
}

/**
 * The context that your code modified the type.
 */
export type ProvidedRouteContext = Omit<RouteContext, 'kita' | 'config'>;
