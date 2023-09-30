import type ts from 'typescript';

import { Parameter, ParameterParser, Route } from '@kitajs/common';
import { kFastifyParam, kReplyParam, kRequestParam } from '../util/constants';
import { getParameterTypeName } from '../util/nodes';

export class FastifyParameterParser implements ParameterParser {
  /** Fastify will always be present */
  agnostic = true;

  supports(param: ts.ParameterDeclaration): boolean | Promise<boolean> {
    const typeName = getParameterTypeName(param);

    return typeName === 'FastifyRequest' || typeName === 'FastifyReply' || typeName === 'FastifyInstance';
  }

  parse(param: ts.ParameterDeclaration, _route: Route): Parameter {
    const typeName = getParameterTypeName(param);

    switch (typeName) {
      case 'FastifyRequest':
        return { value: kRequestParam };

      case 'FastifyReply':
        return { value: kReplyParam };

      case 'FastifyInstance':
        return { value: kFastifyParam };

      default:
        throw new Error(`Unknown Fastify parameter type: ${typeName}`);
    }
  }
}
