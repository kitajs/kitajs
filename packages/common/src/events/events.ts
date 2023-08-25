import { Provider, Route } from '../ast';
import { KitaError } from '../errors';

/**
 * A simple interface map of events that can be emitted by Kita.
 */
export interface KitaEvents {
  kitaError: KitaError;
  provider: Provider;
  route: Route;
  unknownError: Error;
}
