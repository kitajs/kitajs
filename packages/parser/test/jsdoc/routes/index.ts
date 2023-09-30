/**
 * description
 *
 *
 * @operationId hello-world
 * @tag A
 * @tag B
 * @summary C
 */
export function get() {
  return 'Hello world!';
}

/**
 * description A
 *
 * @description B
 */
export function post() {
  return 'Hello world!';
}

/**
 * This should not be used as an empty description is used.
 *
 * @url /not-index
 * @method delete
 * @deprecated
 * @description
 */
export function put() {
  return 'Hello world!';
}
