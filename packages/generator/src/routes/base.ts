import type ts from 'typescript';
import { catchKitaError } from '../errors';
import type { KitaGenerator } from '../generator';
import type { Route } from '../route';
import { isNodeExported, isTypeOnlyNode } from '../util/node';

export type CreationData<N extends ts.Node> = {
  /**
   * The initial node.
   *
   * **Its actually internal type has to be forced by the `supports()` call.**
   */
  node: N;

  /**
   * The main kita generator
   */
  kita: KitaGenerator;

  /**
   * The source of the provided node
   */
  source: ts.SourceFile;
};

export abstract class RouteResolver<N extends ts.Node = ts.Node> {
  /**
   *  Returns true if this resolver supports this route mode
   */
  abstract supports(node: ts.Node): boolean;

  /**
   * Resolves the provided creation data into a route object
   */
  abstract resolve(data: CreationData<N>): Promise<Route | undefined>;

  /**
   * Resolves the provided node into a possible route object.
   */
  static async resolveNode(
    node: ts.Node,
    source: ts.SourceFile,
    kita: KitaGenerator
  ): Promise<Route | undefined> {
    if (!isNodeExported(node) || isTypeOnlyNode(node)) {
      return;
    }

    const resolver = kita.routes.find((resolver) => resolver.supports(node));

    // Ignore nodes that are not supported. We could throw an error here, but sometimes
    // Route configs imports custom named objects (E.g: `Route<{ preHandler: typeof customFn }>`)
    // that has their name not included in some list we would create.
    if (!resolver) {
      return;
    }

    return (
      resolver
        .resolve({
          // Correct typecast
          node: node as typeof resolver extends RouteResolver<infer U>
            ? U
            : typeof resolver,
          source,
          kita
        })
        // A custom catch here to allows multiple parameters errors throw at once.
        .catch(catchKitaError)
    );
  }
}
