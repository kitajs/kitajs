/**
 * D
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
 * Description A
 *
 * B
 */
export function post() {
  return 'Hello world!';
}

/**
 * This should not be used as an empty description is used.
 *
 * @deprecated
 * @function delete
 * @url /not-index
 */
export function put() {
  return 'Hello world!';
}
