import { Parameter } from './parameter';
import { RouteSchema } from './schema';

/** The AST definition for a kitajs route method. */
export interface Route {
  /**
   * The name of the source controller.
   *
   * @example `UserController`
   */
  controllerName: string;

  /**
   * The full path to the original controller method.
   *
   * @example `/usr/file.ts:1:2`
   */
  controllerPrettyPath: string;

  /**
   * The full **IMPORTABLE** path to the original controller method.
   *
   * @example `/usr/file.ts`
   */
  controllerPath: string;

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
}
