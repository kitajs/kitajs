import type { Query } from '@kitajs/runtime';

export interface Complex {
  a: number;
  b: number;
}

/** Hello world rest API endpoint. */
export function get({ a, b }: Query<Complex>) {
  return a + b;
}
