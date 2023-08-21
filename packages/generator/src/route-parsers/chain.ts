import type ts from 'typescript';
import { RouteResolverNotFoundError } from '../errors';
import type { BaseRoute } from '../models';
import type { ChainParser, RouteParser } from '../parsers';
import { toPrettySource } from '../util/nodes';

export class ChainRouteParser implements ChainParser<RouteParser> {
  private readonly parsers = new Set<RouteParser>();
  readonly cache = new WeakMap<ts.Node, RouteParser>();

  add(parser: RouteParser) {
    this.parsers.add(parser);
    return this;
  }

  async supports(node: ts.Node): Promise<boolean> {
    // Checks if the cache already has the node
    if (this.cache.get(node)) {
      return true;
    }

    // Check if this underlying parser supports the node
    for (const parser of this.parsers) {
      if (await parser.supports(node)) {
        this.cache.set(node, parser);
        return true;
      }
    }

    return false;
  }

  async parse(node: ts.Node): Promise<BaseRoute> {
    const parser = this.cache.get(node);

    if (!parser) {
      throw new RouteResolverNotFoundError(toPrettySource(node));
    }

    return parser.parse(node);
  }
}
