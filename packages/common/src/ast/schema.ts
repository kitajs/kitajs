import type { JSONSchema7 } from 'json-schema';

/** Re-exports of `Definition` from `ts-json-schema-generator` and `JSONSchema7` from `json-schema`. */
export type JsonSchema = JSONSchema7;

/**
 * The route schema is a combination of the fastify schema and the ts-json-schema-generator definition. Used to better
 * generate json schemas that can be understood by fastify, ajv and swagger tools.
 */
export interface RouteSchema {
  // We cannot use keyof FastifySchema because packages like @fastify/swagger
  // may add more properties to the schema.
  body?: JsonSchema;
  querystring?: JsonSchema;
  params?: JsonSchema;
  headers?: JsonSchema;
  response?: JsonSchema | Record<string | number, JsonSchema>;

  /**
   * A unique identifier for the operation, can be used in open api definitions and other tools.
   *
   * @example `createUsers`
   */
  operationId: string;

  /** Any possible other key is also allowed */
  [key: string]: unknown;
}
