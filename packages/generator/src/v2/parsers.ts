import type ts from 'typescript';
import type { BaseParameter, BaseRoute } from './bases';

/**
 * A parameter parser is responsible for parsing a node into a parameter.
 */
export interface ParameterParser {
  /**
   * If this parser supports the given node.
   */
  supports(param: ts.ParameterDeclaration): boolean | Promise<boolean>;

  /**
   * Parses the given node into de desired result.
   */
  parse(
    param: ts.ParameterDeclaration,
    route: BaseRoute,
    routeNode: ts.FunctionDeclaration,
    index: number,
  ): BaseParameter | Promise<BaseParameter>;
}

/**
 * A route parser is responsible for parsing a node into a route.
 */
export interface RouteParser {
  /**
   * If this parser supports the given node.
   */
  supports(node: ts.Node): boolean | Promise<boolean>;

  /**
   * Parses the given node into de desired result.
   */
  parse(node: ts.Node): BaseRoute | Promise<BaseRoute>;
}
