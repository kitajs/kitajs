import deepmerge from 'deepmerge';
import type { FastifySchema } from 'fastify';
import type { Definition } from 'ts-json-schema-generator';
import type { BaseParameter } from './base-parameter';

/**
 * A route is a representation of a endpoint http method.
 */
export abstract class BaseRoute {
  /**
   * The name of the source controller.
   *
   * @example `UserController`
   */
  abstract controllerName: string;

  /**
   * The full path to the original controller method.
   *
   * @example `/usr/file.ts:1:2`
   */
  abstract controllerPrettyPath: string;

  /**
   * The full **IMPORTABLE** path to the original controller method.
   *
   * @example `/usr/file.ts`
   */
  abstract controllerPath: string;

  /**
   * The method of the controller. To be used as `Controller.<METHOD>()`
   *
   * @example `get`
   */
  abstract controllerMethod: string;

  /**
   * All possible parameters for this route.
   */
  abstract parameters: BaseParameter[];

  /**
   * The controller http path.
   *
   * @example `/users/create`
   */
  abstract url: string;

  /**
   * The controller http method.
   *
   * @example `get`
   */
  abstract method: string;

  /**
   * A "jsonified" string for the fastify route options
   */
  abstract options: string | object | undefined;

  /**
   * The fastify schema for this route.
   */
  abstract schema: FastifySchema;

  /**
   * Merges the current schema with the given schema.
   */
  mergeSchema(schema: Partial<this['schema'] | Definition>) {
    this.schema = deepmerge(this.schema, schema);
  }
}
