import type ts from 'typescript';
import { AgnosticRouteConflict, ParameterResolverNotFound } from '../errors';
import type { BaseParameter, BaseRoute } from '../models';
import type { ParameterParser } from '../parsers';
import { toPrettySource } from '../util/nodes';

export class ChainParameterParser implements ParameterParser {
  /** Chain will always be agnostic, since it does nothing by its own */
  agnostic = true;

  private readonly parsers = new Set<ParameterParser>();

  /**
   * A simple node cache to increase the performance at parse() when getting the correct parser
   */
  private readonly cache = new WeakMap<ts.ParameterDeclaration, ParameterParser>();

  /**
   * Adds a parser to this chain.
   */
  addParser(parser: ParameterParser) {
    this.parsers.add(parser);
    return this;
  }

  async supports(node: ts.ParameterDeclaration): Promise<boolean> {
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

  parse(
    param: ts.ParameterDeclaration,
    route: BaseRoute | null,
    routeNode: ts.FunctionDeclaration,
    paramIndex: number
  ): BaseParameter | Promise<BaseParameter> {
    const parser = this.cache.get(param);

    if (!parser) {
      throw new ParameterResolverNotFound( toPrettySource(param));
    }

    if (!parser.agnostic && !route) {
      throw new AgnosticRouteConflict( toPrettySource(param));
    }

    return parser.parse(param, route, routeNode, paramIndex);
  }
}
