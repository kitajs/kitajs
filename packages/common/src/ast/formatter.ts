import { Promisable } from 'type-fest';
import { KitaPlugin } from './plugin';
import { Route } from './route';
import { JsonSchema } from './schema';

export interface SourceFormatter {
  /** Called each time a route needs to be generated */
  generateRoute(r: Route): Promisable<void>;

  /** Called after all routes have been generated. This is the place to generate the runtime and everything it may needs. */
  generateRuntime(routes: Route[], schemas: JsonSchema[], plugins: KitaPlugin[]): Promisable<void>;
}
