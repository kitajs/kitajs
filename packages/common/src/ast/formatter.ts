import { Definition } from 'ts-json-schema-generator';
import { Promisable } from 'type-fest';
import { Route } from './route';

export interface SourceFormatter {
  /** Called after each route is generated */
  generateRoute(r: Route): Promisable<void>;

  /** Called after all routes were generated */
  generate(routes: Route[], schemas: Definition[]): Promisable<void>;

  /** Writes all the files to disk */
  flush(): Promisable<void>;
}
