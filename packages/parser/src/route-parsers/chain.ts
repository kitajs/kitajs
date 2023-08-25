import { ChainParser, Route, RouteParser, RouteResolverNotFoundError } from '@kitajs/common';
import type ts from 'typescript';
import { toPrettySource } from '../util/nodes';

export class ChainRouteParser extends ChainParser<RouteParser> implements RouteParser {
  async parse(node: ts.Node): Promise<Route> {
    const parser = super.cache.get(node);

    if (!parser) {
      throw new RouteResolverNotFoundError(toPrettySource(node));
    }

    return parser.parse(node);
  }
}
