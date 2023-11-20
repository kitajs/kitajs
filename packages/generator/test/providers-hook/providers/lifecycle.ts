import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export interface H2 {
  h2: 2;
}

export default function (): H2 {
  return { h2: 2 };
}

export async function preHandler(this: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
  //@ts-expect-error
  this.h2h = { h2a: 2 };
  //@ts-expect-error
  request.h2h = { h2b: 2 };
  //@ts-expect-error
  reply.h2h = { h2c: 3 };
  return;
}
