import type { RouteSchema } from './schema';

/**
 * A parameter is a representation of a route parameter.
 */
export interface BaseParameter {
  /**
   * The resolved parameter text to be evaluated
   *
   * @example `req.params.id`
   */
  value: string;

  /**
   * Any code that needs to be executed before, to this parameter work
   *
   * @example `const resolved = await CustomParameterResolver.resolve(param)`
   */
  helper?: string;
}

/**
 * A route is a representation of a endpoint http method.
 */
export interface BaseRoute {
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

  /**
   * All possible parameters for this route.
   */
  parameters: BaseParameter[];

  /**
   * The controller http path.
   *
   * @example `/users/create`
   */
  url: string;

  /**
   * The controller http method.
   *
   * @example `get`
   */
  method: Uppercase<string>;

  /**
   * A "jsonified" string for the fastify route options
   */
  options: string | object | undefined;

  /**
   * The fastify schema for this route.
   */
  schema: RouteSchema;
}
