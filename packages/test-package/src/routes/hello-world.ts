import type { Query } from '@kitajs/runtime';

/**
 * Hello world rest API endpoint.
 */
export function get(name: Query = 'world') {
  return `Hello ${name}!`;
}
