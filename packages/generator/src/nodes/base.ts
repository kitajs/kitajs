import { ts } from '@kitajs/ts-json-schema-generator';
import type { KitaGenerator } from '..//generator';
import { catchKitaError } from '../errors';
import type { BaseRoute } from '../routes/base';
import { isNodeExported, isNodeType } from '../util/node';

export interface NodeInfo {
  /** initial node */
  node: ts.Node;
}

export interface NodeData<N extends ts.Node = ts.Node> {
  /** The initial node */
  node: N;

  /** The main kita generator */
  kita: KitaGenerator;

  /** The source of the provided node */
  source: ts.SourceFile;
}

/**
 * Node resolver is a class that transforms a exported typescript node into a possible {@link BaseRoute}.
 */
export abstract class NodeResolver {
  /** Returns true if this resolver supports this route mode */
  abstract supports(node: NodeInfo): boolean;

  /** Resolves the provided route into a {@link Route} object. */
  abstract resolve(data: NodeData): Promise<BaseRoute | undefined>;

  /** All registered resolvers */
  static readonly resolvers: NodeResolver[] = [];

  /** Tries to resolve all functions from a source file. */
  static readonly resolveSource = (
    source: ts.SourceFile,
    kita: KitaGenerator
  ): Promise<BaseRoute | undefined>[] => {
    const promises = [] as Promise<BaseRoute | undefined>[];

    ts.forEachChild(source, (node) => {
      if (!isNodeExported(node) || isNodeType(node)) {
        return;
      }

      const resolver = NodeResolver.resolvers.find((resolver) =>
        resolver.supports({ node })
      );

      // Ignore nodes that are not supported. We could throw an error here, but sometimes
      // Route<{}> configs imports custom named objects that has their name not included in some
      // list we would create.
      if (!resolver) {
        return;
      }

      promises.push(
        resolver
          .resolve({
            node,
            source,
            kita
          })
          .catch(catchKitaError)
      );
    });

    return promises;
  };
}
