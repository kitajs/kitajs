import { Promisable } from 'type-fest';
import { Route } from './route';
import { JsonSchema } from './schema';

export interface SourceFormatter {
  /** Called after each route is generated */
  generateRoute(r: Route): Promisable<void>;

  /** Called after all routes were generated */
  generate(routes: Route[], schemas: JsonSchema[]): Promisable<void>;

  /** Writes all the files to disk */
  flush(): Promisable<void>;

  /** Called when a file is written */
  onWrite?: (filename: string) => void;
}
