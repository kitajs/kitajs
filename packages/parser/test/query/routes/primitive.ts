import type { Query } from '@kitajs/common';

/** Hello world rest API endpoint. */
export function get(name: Query, age: Query<number>, type: Query<string, 'custom name'>) {
  return `Hello ${name} ${age} ${type}!`;
}
