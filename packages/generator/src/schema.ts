import type { FastifySchema } from 'fastify';
import type { Definition } from 'ts-json-schema-generator';

// TODO: Move this type to runtime
export interface RouteSchema
  extends Definition,
    Partial<Record<keyof FastifySchema, Definition>> {
  /**
   * A unique identifier for the operation, can be used in open api definitions and other tools.
   *
   * @example `createUsers`
   */
  operationId: string;

  /**
   * Any possible other key is also allowed
   */
  [key: string]: unknown;
}
