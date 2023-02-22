import type ts from 'typescript';
import type { BaseParameter } from './base-parameter';
import type { BaseRoute } from './base-route';

export abstract class ParameterParser {
  /**
   * If this parser supports the given node.
   */
  abstract supports(param: ts.ParameterDeclaration): boolean | Promise<boolean>;

  /**
   * Parses the given node into de desired result.
   */
  abstract parse(
    param: ts.ParameterDeclaration,
    index: number,
    route: BaseRoute,
    routeNode: ts.FunctionDeclaration
  ): BaseParameter | Promise<BaseParameter>;
}
