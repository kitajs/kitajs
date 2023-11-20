import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export interface H3 {
  h3: 3;
}

export default function (): H3 {
  return { h3: 3 };
}

export async function preHandler(this: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
  //@ts-expect-error
  this.h3h = { h3a: 2 };
  //@ts-expect-error
  request.h3h = { h3b: 2 };
  //@ts-expect-error
  reply.h3h = { h3c: 3 };
  return;
}

export async function onReady(this: FastifyInstance) {
  //@ts-expect-error
  this.h3r = { h3d: 1 };
  return;
}
