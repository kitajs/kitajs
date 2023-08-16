import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async function (
  request: FastifyRequest,
  response: FastifyReply,
  fastify: FastifyInstance
): Promise<{ a: 1 }> {
  return {
    a: 1
  };
}

export function transformSchema(schema: any) {

}