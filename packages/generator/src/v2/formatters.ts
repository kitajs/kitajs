import type { BaseParameter, BaseRoute } from './models';

/**
 * A parameter parser is responsible for parsing a node into a parameter.
 */
export interface ParameterFormatter {
  /**
   * If this parser supports the given node.
   */
  supports(route: BaseParameter): boolean | Promise<boolean>;

  /**
   * Parses the given node into de desired result.
   */
  format(parameter: BaseParameter): string | Promise<string>;
}

/**
 * A route parser is responsible for parsing a node into a route.
 */
export interface RouteFormatter {
  /**
   * If this parser supports the given node.
   */
  supports(route: BaseRoute): boolean | Promise<boolean>;

  /**
   * Parses the given node into de desired result.
   */
  format(route: BaseRoute): string | Promise<string>;
}
