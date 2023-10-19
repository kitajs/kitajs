import type { Query } from '@kitajs/runtime';

export function get(
  name: Query,
  age: Query<number>,
  type: Query<string, 'custom name'>,
  date: Query<Date>,
  arr: Query<number[]>
) {
  return `Hello ${name} ${age} ${type} at ${date} with ${arr}!`;
}
