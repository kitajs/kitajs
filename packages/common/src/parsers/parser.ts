/** A simple parser interface. */
export interface Parser<T = unknown, R = unknown, Args extends unknown[] = unknown[]> {
  /** If this parser supports the given node. */
  supports(type: T): boolean;

  /** Parses the given node into de desired result. */
  parse(type: T, ...args: Args): R;
}
