/**
 * D
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
 * @deprecated
 * @description
 */
export function put() {
  return 'Hello world!';
}

/**
 * @internal
 */
export function Delete() {
  return 'Hello world!';
}
