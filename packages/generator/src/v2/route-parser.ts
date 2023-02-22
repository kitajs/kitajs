import type ts from 'typescript';
import type { BaseRoute } from './base-route';

export abstract class RouteParser {
  /**
   * If this parser supports the given node.
   */
  abstract supports(node: ts.Node): boolean | Promise<boolean>;

  /**
   * Parses the given node into de desired result.
   */
  abstract parse(node: ts.Node): BaseRoute | Promise<BaseRoute>;
}
