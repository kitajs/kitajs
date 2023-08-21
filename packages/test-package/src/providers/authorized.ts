import { RouteSchema } from '@kitajs/generator/dist/schema';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export type Authorized = { a: 1 };

export default async function (
  // header: Header<'a'>
  request: FastifyRequest,
  response: FastifyReply,
  fastify: FastifyInstance
): Promise<{ a: 1 }> {
  return {
    a: 1
  };
}

export function transformSchema(schema: RouteSchema) {}
