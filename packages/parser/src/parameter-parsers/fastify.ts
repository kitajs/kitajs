import type ts from 'typescript';

import { Parameter, ParameterParser, Route } from '@kitajs/common';
import { kFastifyParam, kReplyParam, kRequestParam } from '../util/constants';
import { getTypeNodeName } from '../util/nodes';

export class FastifyParameterParser implements ParameterParser {
  /** Fastify will always be present */
  agnostic = true;

  supports(param: ts.ParameterDeclaration) {
    const typeName = getTypeNodeName(param);

    switch (typeName) {
      case 'FastifyRequest':
      case 'FastifyReply':
      case 'FastifyInstance':
        return true;

      default:
        return false;
    }
  }

  parse(param: ts.ParameterDeclaration, _route: Route): Parameter {
    const typeName = getTypeNodeName(param);

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
