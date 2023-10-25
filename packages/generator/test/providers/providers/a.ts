import { RouteSchema } from '@kitajs/runtime';
import { FastifyRequest } from 'fastify';

export type MyProvider = string;

export default function (req: FastifyRequest): MyProvider {
  return req.id;
}

export function transformSchema(schema: RouteSchema) {
  //@ts-ignore - this is a test
  schema.description = 'Overridden description';

  return schema;
}
