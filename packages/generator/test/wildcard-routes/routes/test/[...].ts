import type { Path } from '@kitajs/runtime';

export function get(remaining: Path<string, '*'>) {
  return { remaining };
}
