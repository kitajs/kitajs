import type { FastifySchema } from 'fastify';
import type { Definition } from 'ts-json-schema-generator';

/**
 * The route schema is a combination of the fastify schema and the ts-json-schema-generator definition. Used to better
 * generate json schemas that can be understood by fastify, ajv and swagger tools.
 */
export interface RouteSchema extends Partial<Record<keyof FastifySchema, Definition>> {
  /**
   * A unique identifier for the operation, can be used in open api definitions and other tools.
   *
   * @example `createUsers`
   */
  operationId: string;

  /** Any possible other key is also allowed */
  [key: string]: unknown;
}
