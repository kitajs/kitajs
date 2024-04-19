import {
  ChainParser,
  ParameterResolverNotFoundError,
  type Parameter,
  type ParameterParser,
  type Route
} from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';

export class ChainParameterParser extends ChainParser<ParameterParser> implements ParameterParser {
  parse(
    param: ts.ParameterDeclaration,
    route: Route | null,
    routeNode: ts.FunctionDeclaration,
    paramIndex: number
  ): Parameter {
    const parser = this.cache.get(param);

    if (!parser) {
      throw new ParameterResolverNotFoundError(param.type || param);
    }

    return parser.parse(param, route, routeNode, paramIndex);
  }
}
