import type { Query } from '@kitajs/runtime';

/** Hello world API endpoint. */
export function get(name: Query = 'World') {
  return `Hello ${name}!`;
}
