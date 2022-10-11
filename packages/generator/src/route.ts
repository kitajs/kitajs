import type { FastifySchema } from 'fastify';
import type { Parameter } from './parameter';

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
   * The fastify schema for this route.
   */
  schema: FastifySchema & {
    /**
     * The open api operation id.
     *
     * @example `createUsers`
     */
    operationId?: string;
  };

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
  method: string;

  /**
   * A "jsonified" string for the fastify route options
   */
  options?: string;

  /**
   * The rendered route.
   */
  rendered: string;
}

/** The route generated from a WebsocketResolver */
export type WebsocketRoute = Route & {
  websocket: true;

  controllerMethod: 'ws';

  method: 'GET';

  schema: { hide: true };
};

/** The rouge generated from a AsyncResolver  */
export type AsyncRoute = Route & {
  async: true;

  schema: FastifySchema & { operationId: string };

  /** The complete path to the controller be lazy imported */
  importablePath: string;
};
