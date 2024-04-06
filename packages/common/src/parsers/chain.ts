import { predicateRace } from '../util';
import type { Parser } from './parser';

export abstract class ChainParser<P extends Parser<object>> implements Pick<Parser<P>, 'supports'> {
  /** All the parsers in this chain. */
  protected parsers = new Set<P>();

  /** A simple node cache to increase the performance at parse() when getting the correct parser */
  protected cache = new WeakMap<Parameters<P['supports']>[0], P>();

  /** Adds a parser to this chain. */
  add(parser: P) {
    this.parsers.add(parser);
    return this;
  }

  /** Checks if the given node is supported by any of the parsers and caches the result. */
  async supports(node: Parameters<P['supports']>[0]) {
    // Checks if the cache already has the node
    if (this.cache.get(node)) {
      return true;
    }

    // Asynchronously checks if any of the parsers supports the node
    const parser = await predicateRace(this.parsers, this.parsers.size, 'supports', node);

    // No parser was found
    if (!parser) {
      return false;
    }

    this.cache.set(node, parser);
    return true;
  }
}
