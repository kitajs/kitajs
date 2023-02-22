import type ts from 'typescript';
import type { BaseRoute } from '../base-route';
import { RouteResolverNotFound } from '../errors';
import { RouteParser } from '../route-parser';

export class ChainRouteParser extends RouteParser {
  private readonly parsers: RouteParser[] = [];

  /** A simple node cache to increase the performance at parse() when getting the correct parser.  */
  private readonly cache = new WeakMap<ts.Node, RouteParser>();

  /**
   * Adds a parser to this chain.
   */
  addParser(...parser: RouteParser[]) {
    this.parsers.push(...parser);
    return this;
  }

  async supports(node: ts.Node): Promise<boolean> {
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
