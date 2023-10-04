import type { Header } from '@kitajs/runtime';

/** Hello world rest API endpoint. */
export function get(name: Header<'x-name'> = 'world') {
  return `Hello ${name}`;
}
