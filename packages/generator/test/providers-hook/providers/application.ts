import { FastifyInstance } from 'fastify';

export interface H1 {
  h1: 1;
}

export default function (): H1 {
  return { h1: 1 };
}

export async function onReady(this: FastifyInstance) {
  //@ts-expect-error
  this.h1r = { h1: 1 };
  return;
}
