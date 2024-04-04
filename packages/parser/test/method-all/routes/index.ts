import type { Query } from '@kitajs/runtime';

/** Hello world API endpoint. */
export function all(name: Query = 'World') {
  return `Hello ${name}!`;
}
