import { ChainParser, RouteResolverNotFoundError, type Route, type RouteParser } from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';

export class ChainRouteParser extends ChainParser<RouteParser> implements RouteParser {
  parse(node: ts.Node): Route {
    const parser = this.cache.get(node);

    if (!parser) {
      throw new RouteResolverNotFoundError(node);
    }

    return parser.parse(node);
  }
}
