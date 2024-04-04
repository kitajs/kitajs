import type { Parameter } from './parameter';
import type { RouteSchema } from './schema';

/** The AST definition for a kitajs route method. */
export interface Route {
  /**
   * The kind of this route
   *
   * @example 'rest' or 'html'
   */
  kind: string;

  /**
   * The config's `cwd` relative path to the controller.
   *
   * @example `usr/file.ts`
   */
  relativePath: string;

  /**
   * The method of the controller. To be used as `Controller.<METHOD>()`
   *
   * @example `get`
   */
  controllerMethod: string;

  /** All possible parameters for this route. */
  parameters: Parameter[];

  /**
   * The controller http path.
   *
   * @example `/users/create`
   */
  url: string;

  /**
   * The controller http **uppercase** method.
   *
   * @example `GET`
   */
  method: string;

  /**
   * A wrapper of method calls for this route option. Use $1 to represent where we should insert the object.
   *
   * @example `Controller.a(Controller.b($1))`
   */
  options?: string;

  /** The fastify schema for this route. */
  schema: RouteSchema;

  /**
   * What method of reply should be used to send the response.
   *
   * @example
   *
   * ```ts
   * // Html routes uses 'html'
   * reply.html(response);
   * ```
   *
   * @default 'send'
   */
  customSend?: string;
}
