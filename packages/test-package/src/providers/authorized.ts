import { Header } from '@kitajs/runtime';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export type Authorized = {a :1}

export default async function (
  // header: Header<'a'>
  request: FastifyRequest,
  response: FastifyReply,
  fastify: FastifyInstance
): Promise<Authorized> {
  return {
    a: 1
  };
}

export function transformSchema(schema: any) {

}
