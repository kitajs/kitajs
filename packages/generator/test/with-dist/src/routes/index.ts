import type { Query } from '@kitajs/runtime';

export function get(name: Query = 'World') {
  return `Hello ${name}!`;
}
