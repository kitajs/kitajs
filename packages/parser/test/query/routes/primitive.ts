import type { Query } from '@kitajs/runtime';

export function get(name: Query, age: Query<number>, type: Query<string, 'custom name'>) {
  return `Hello ${name} ${age} ${type}!`;
}
