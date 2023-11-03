import { ChainParser, Route, RouteParser, RouteResolverNotFoundError } from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';
import { Promisable } from 'type-fest';

export class ChainRouteParser extends ChainParser<RouteParser> implements RouteParser {
  parse(node: ts.Node): Promisable<Route> {
    const parser = this.cache.get(node);

    if (!parser) {
      throw new RouteResolverNotFoundError(node);
    }

    return parser.parse(node);
  }
}
