import type { Query } from '@kitajs/runtime';

export interface Complex {
  a: number;
  b: number;
}

export function get({ a, b }: Query<Complex>) {
  return a + b;
}
