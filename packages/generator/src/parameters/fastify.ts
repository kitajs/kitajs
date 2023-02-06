import { KitaError } from '../errors';
import type { Parameter } from '../parameter';
import { ParamData, ParamInfo, ParamResolver } from './base';

export class FastifyResolver extends ParamResolver {
  override supports({ typeName }: ParamInfo): boolean {
    return (
      typeName === 'FastifyRequest' ||
      typeName === 'FastifyReply' ||
      typeName === 'FastifyInstance'
    );
  }

  override async resolve({
    route,
    typeName,
    inferredType
  }: ParamData): Promise<Parameter | undefined> {
    switch (typeName) {
      case 'FastifyRequest':
        return {
          value: 'websocket' in route ? `request as ${inferredType}` : 'request'
        };

      case 'FastifyReply':
        return {
          value: 'websocket' in route ? `reply as ${inferredType}` : 'reply'
        };

      case 'FastifyInstance':
        return {
          value: 'websocket' in route ? `fastify as ${inferredType}` : 'fastify'
        };
    }

    throw KitaError('Unknown Fastify type', route.controllerPath);
  }
}
