import type { Query } from '@kitajs/runtime';

/** Hello world rest API endpoint. */
export function $get(this: void, name: Query = 'world') {
  return `Hello ${name}`;
}

export const $get = {};
