import { Promisable } from 'type-fest';
import { KitaError } from '../errors';
import { Provider } from './provider';
import { Route } from './route';
import { JsonSchema } from './schema';

/**
 * A KitaParser instance is a representation of a AST parser. It is used to read all source files and parse them into an
 * array of routes, schemas and providers.
 */
export interface AstCollector {
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
  getSchema(ref: string): JsonSchema | undefined;

  /** Returns all schemas defined by this server. */
  getSchemas(): JsonSchema[];

  /** Returns the number of schemas defined by this server. */
  getSchemaCount(): number;

  /**
   * Parses all the given files, one by one, and yields the errors. If the array is empty, the parsing was successful.
   * You can get all routes, providers and schemas by calling the corresponding methods.
   *
   * You can also manually provide different controller and provider paths to parse only a subset of files.
   */
  parse(controllerPaths?: string[], providerPaths?: string[]): AsyncGenerator<KitaError, void, void>;

  // hooks
  onRoute?: (r: Route) => Promisable<void>;
  onProvider?: (r: Provider) => Promisable<void>;
  onSchema?: (r: JsonSchema) => void;
}
