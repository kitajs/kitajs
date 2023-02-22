import type ts from 'typescript';
import type { BaseParameter } from '../base-parameter';
import type { BaseRoute } from '../base-route';
import { ParameterResolverNotFound } from '../errors';
import { ParameterParser } from '../parameter-parser';

export class ChainParameterParser extends ParameterParser {
  private readonly parsers: ParameterParser[] = [];

  /** A simple node cache to increase the performance at parse() when getting the correct parser.  */
  private readonly cache = new WeakMap<ts.ParameterDeclaration, ParameterParser>();

  /**
   * Adds a parser to this chain.
   */
  addParser(...parsers: ParameterParser[]) {
    this.parsers.push(...parsers);
    return this;
  }

  async supports(node: ts.ParameterDeclaration): Promise<boolean> {
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
    index: number,
    route: BaseRoute,
    routeNode: ts.FunctionDeclaration
  ): BaseParameter | Promise<BaseParameter> {
    const parser = this.cache.get(param);

    if (!parser) {
      throw new ParameterResolverNotFound(param);
    }

    return parser.parse(param, index, route, routeNode);
  }
}
