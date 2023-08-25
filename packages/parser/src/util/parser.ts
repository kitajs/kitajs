import { Parser, predicateRace } from '@kitajs/common';

/**
 * Checks if the given node is supported by any of the parsers and caches the result.
 */
export async function cachedSupports<N extends object, P extends Parser>(
  node: N,
  cache: WeakMap<N, P>,
  parsers: Set<P>
): Promise<boolean> {
  // Checks if the cache already has the node
  if (cache.get(node)) {
    return true;
  }

  // Asynchronously checks if any of the parsers supports the node
  const parser = await predicateRace(parsers, parsers.size, 'supports', node);

  // No parser was found
  if (!parser) {
    return false;
  }

  cache.set(node, parser);
  return true;
}
