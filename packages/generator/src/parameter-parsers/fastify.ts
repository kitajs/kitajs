import type ts from 'typescript';
import type { BaseParameter, BaseRoute } from '../models';
import { FastifyParameter } from '../parameters/fastify';
import type { ParameterParser } from '../parsers';
import { getParameterTypeName } from '../util/nodes';

export class FastifyParameterParser implements ParameterParser {
  /** Fastify will always be present */
  agnostic = true;

  supports(param: ts.ParameterDeclaration): boolean | Promise<boolean> {
    const typeName = getParameterTypeName(param);

    return typeName === 'FastifyRequest' || typeName === 'FastifyReply' || typeName === 'FastifyInstance';
  }

  parse(param: ts.ParameterDeclaration, _route: BaseRoute): BaseParameter | Promise<BaseParameter> {
    const typeName = getParameterTypeName(param);

    return new FastifyParameter(typeName!);
  }
}
