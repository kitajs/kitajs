import {
  AgnosticRouteConflictError,
  ChainParser,
  Parameter,
  ParameterParser,
  ParameterResolverNotFoundError,
  Route
} from '@kitajs/common';
import { Promisable } from 'type-fest';
import type ts from 'typescript';
import { toPrettySource } from '../util/nodes';

export class ChainParameterParser extends ChainParser<ParameterParser> implements ParameterParser {
  /** Chain will always be agnostic, since it does nothing by its own */
  agnostic = true;

  parse(
    param: ts.ParameterDeclaration,
    route: Route | null,
    routeNode: ts.FunctionDeclaration,
    paramIndex: number
  ): Promisable<Parameter> {
    const parser = this.cache.get(param);

    if (!parser) {
      throw new ParameterResolverNotFoundError(toPrettySource(param));
    }

    if (!parser.agnostic && !route) {
      throw new AgnosticRouteConflictError(toPrettySource(param));
    }

    return parser.parse(param, route, routeNode, paramIndex);
  }
}
