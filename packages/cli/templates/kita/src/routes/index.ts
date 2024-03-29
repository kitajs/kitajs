import type { Query } from '@kitajs/runtime';

/**
 * @tag Hello
 * @operationId getHello
 * @summary Get a hello message with date
 */
export function get(name: Query = 'World') {
  return {
    name,
    message: `Hello ${name}!`
  };
}
