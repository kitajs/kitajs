import { Definition } from 'ts-json-schema-generator';
import { KitaError } from '../errors';
import { Provider } from './provider';
import { Route } from './route';

/**
 * A KitaParser instance is a representation of a AST parser. It is used to read all source files and parse them into an
 * array of routes, schemas and providers.
 */
export interface KitaParser {
  /** Returns a provider by its name. */
  getProvider(type: string): Provider | undefined;

  /** Returns all providers defined by this server. */
  getProviders(): Provider[];

  /** Returns the number of providers defined by this server. */
  getProviderCount(): number;

  /** Returns a route by its operationId. */
  getRoute(operationId: string): Route | undefined;

  /** Returns all routes defined by this server. */
  getRoutes(): Route[];

  /** Returns the number of routes defined by this server. */
  getRouteCount(): number;

  /** Returns a schema by its reference id. */
  getSchema(ref: string): Definition | undefined;

  /** Returns all schemas defined by this server. */
  getSchemas(): Definition[];

  /** Returns the number of schemas defined by this server. */
  getSchemaCount(): number;

  /**
   * Parses all the given files, one by one, and yields the errors. If the array is empty, the parsing was successful.
   * You can get all routes, providers and schemas by calling the corresponding methods.
   */
  parse(): AsyncGenerator<KitaError, void, void>;
}
