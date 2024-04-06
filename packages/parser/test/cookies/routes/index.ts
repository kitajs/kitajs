import type { Cookie } from '@kitajs/runtime';

export function get(a: Cookie, b: Cookie<'c c'>, d: Cookie<'d', number>) {
  return a + b + d?.toString();
}

export function post(a: Cookie = '', b: Cookie = 'Hello', c: Cookie, d?: Cookie) {
  return a + b + c + d;
}
