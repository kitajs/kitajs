import {
  AgnosticRouteConflictError,
  ChainParser,
  Parameter,
  ParameterParser,
  ParameterResolverNotFoundError,
  Route
} from '@kitajs/common';
import type { Promisable } from 'type-fest';
import type ts from 'typescript';

export class ChainParameterParser extends ChainParser<ParameterParser> implements ParameterParser {
  agnostic = true;

  parse(
    param: ts.ParameterDeclaration,
    route: Route | null,
    routeNode: ts.FunctionDeclaration,
    paramIndex: number
  ): Promisable<Parameter> {
    const parser = this.cache.get(param);

    if (!parser) {
      throw new ParameterResolverNotFoundError(param.type || param);
    }

    if (parser.agnostic === false && !route) {
      throw new AgnosticRouteConflictError(param);
    }

    return parser.parse(param, route, routeNode, paramIndex);
  }
}
