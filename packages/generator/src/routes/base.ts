import type { FastifySchema } from 'fastify';
import type { Parameter } from '../parameter';

/**
 * The base route is just an abstract class to wrap any possible route that can be generated.
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
  parameters: Parameter[];

  /**
   * The path to be concatenated with the provided config.templates path.
   *
   * @example
   * ```ts
   * config.templates = '@kita/generator/templates'
   * templatePath = 'routes/rest.hbs'
   * result = '@kita/generator/templates/routes/rest.hbs'
   * ```
   */
  templatePath: string;

  /**
   * The compiled and generated string from the provided template path.
   *
   * This is only created when this BaseRoute is added to the AST routes.
   */
  template?: string;

  /**
   * The fastify schema for this route.
   */
  schema: FastifySchema;

  /**
   * The controller http route.
   *
   * @example `/users/create`
   */
  route: string;

  /**
   * The controller http method.
   *
   * @example `get`
   */
  method: string;

  /**
   * The open api operation id.
   *
   * @example `createUsers`
   */
  operationId?: string;

  /**
   * A jsonified string for the fastify route options
   */
  options?: string;
}
