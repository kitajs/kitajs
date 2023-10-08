import type { Query } from '@kitajs/runtime';

/**
 * Hello world API endpoint. This comment will be used as the swagger description.
 *
 * The name parameter is going to be runtime validated and extract from que query string. If the name is not provided,
 * the default value will be used.
 */
export function get(name: Query) {
  return `Hello ${name}!`;
}
