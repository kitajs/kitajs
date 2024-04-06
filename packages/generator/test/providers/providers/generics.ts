import type { ProviderGenerics, RouteSchema } from '@kitajs/runtime';
import type { FastifyInstance, FastifyRequest } from 'fastify';

export type GenericTest<_T extends number> = [string, number, string];

export default function (
  request: FastifyRequest,
  params: ProviderGenerics<[number]>,
  instance: FastifyInstance
): GenericTest<number> {
  return [request.id, params[0], instance.version];
}

export function transformSchema(schema: RouteSchema, params: ProviderGenerics<[number]>): RouteSchema {
  //@ts-ignore - this is a test
  schema.description = params.join(',');
  return schema;
}
