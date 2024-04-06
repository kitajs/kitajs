import type { ts } from 'ts-json-schema-generator';

import {
  kFastifyParam,
  kReplyParam,
  kRequestParam,
  type Parameter,
  type ParameterParser,
  type Route
} from '@kitajs/common';
import { getTypeNodeName } from '../util/nodes';

export class FastifyParameterParser implements ParameterParser {
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
        return {
          name: FastifyParameterParser.name,
          value: kRequestParam
        };

      case 'FastifyReply':
        return {
          name: FastifyParameterParser.name,
          value: kReplyParam
        };

      case 'FastifyInstance':
        return {
          name: FastifyParameterParser.name,
          value: kFastifyParam
        };

      default:
        throw new Error(`Unknown Fastify parameter type: ${typeName}`);
    }
  }
}
