import type ts from 'typescript';
import type { BaseParameter, BaseRoute } from './models';

/**
 * A parameter parser is responsible for parsing a node into a parameter.
 */
export interface ParameterParser {
  /**
   * If this parser supports every type of router.
   * This means that it can be resolved into another side functions, like providers.
   */
  agnostic: boolean;

  /**
   * If this parser supports the given node.
   */
  supports(param: ts.ParameterDeclaration): boolean | Promise<boolean>;

  /**
   * Parses the given node into de desired result.
   * 
   * @param route The route that this parameter belongs to or null if it's {@link agnostic}
   */
  parse(
    param: ts.ParameterDeclaration,
    route: BaseRoute | null,
    routeNode: ts.FunctionDeclaration,
    index: number
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
