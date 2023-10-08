import type { Body, Query } from '@kitajs/runtime';

/**
 * Hello world API endpoint. This comment will be used as the swagger description.
 *
 * The name parameter is going to be runtime validated and extract from que query string. If the name is not provided,
 * the default value will be used.
 */
export function get(name: Query = 'World', b: Body<{ a: 1 }>) {
  return `Hello ${name}!`;
}
