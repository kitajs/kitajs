import type { FastifyReply, FastifyRequest } from 'fastify';

export type ComplexParam<Option extends boolean> = Option extends true ? 'yes' : 'no';

export function resolver(_req: FastifyRequest, _rep: FastifyReply, option: boolean) {
  return option ? 'yes' : 'no';
}
