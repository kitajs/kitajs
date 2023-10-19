import { ProviderGenerics } from '@kitajs/runtime';
import { FastifyInstance, FastifyRequest } from 'fastify';

export type GenericTest<_T extends number> = [string, number, string];

export default function (
  request: FastifyRequest,
  params: ProviderGenerics<[number]>,
  instance: FastifyInstance
): GenericTest<any> {
  return [request.id, params[0], instance.version];
}
