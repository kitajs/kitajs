import type ts from 'typescript';
import type { BaseRoute } from '../models';
import { RouteResolverNotFound } from '../errors';
import type { RouteParser } from '../parsers';

export class ChainRouteParser implements RouteParser {
  private readonly parsers = new Set<RouteParser>();

  /**
   * A simple node cache to increase the performance at parse() when getting the correct parser.
   */
  private readonly cache = new WeakMap<ts.Node, RouteParser>();

  /**
   * Adds a parser to this chain.
   */
  addParser(parser: RouteParser) {
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
      throw new RouteResolverNotFound(node);
    }

    return parser.parse(node);
  }
}
