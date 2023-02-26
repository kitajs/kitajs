import type { FastifySchema } from 'fastify';
import type { Definition } from 'ts-json-schema-generator';

export interface RouteSchema extends Partial<Definition>, FastifySchema {
  /**
   * The open api operation id.
   *
   * @example `createUsers`
   */
  operationId?: string;
}
