import type { ts } from 'ts-json-schema-generator';

import { Parameter, ParameterParser, Route, kFastifyParam, kReplyParam, kRequestParam } from '@kitajs/common';
import { getTypeNodeName } from '../util/nodes';

export class FastifyParameterParser implements ParameterParser {
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
