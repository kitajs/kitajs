import { ChainParser, Route, RouteParser, RouteResolverNotFoundError } from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';

export class ChainRouteParser extends ChainParser<RouteParser> implements RouteParser {
  async parse(node: ts.Node): Promise<Route> {
    const parser = this.cache.get(node);

    if (!parser) {
      throw new RouteResolverNotFoundError(node);
    }

    return parser.parse(node);
  }
}
