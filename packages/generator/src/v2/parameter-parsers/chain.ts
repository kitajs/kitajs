import type ts from 'typescript';
import type { BaseParameter, BaseRoute } from '../models';
import { ParameterResolverNotFound } from '../errors';
import type { ParameterParser } from '../parsers';

export class ChainParameterParser implements ParameterParser {
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
    route: BaseRoute,
    routeNode: ts.FunctionDeclaration,
    paramIndex: number
  ): BaseParameter | Promise<BaseParameter> {
    const parser = this.cache.get(param);

    if (!parser) {
      throw new ParameterResolverNotFound(param);
    }

    return parser.parse(param, route, routeNode, paramIndex);
  }
}
