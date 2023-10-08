import type { Body } from '@kitajs/runtime';

export interface Complex {
  a: number;
  b: number;
}

export function post({ a, b }: Body<Complex>) {
  return a + b;
}
