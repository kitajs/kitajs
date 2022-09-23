import type { Route } from '@kitajs/runtime';
import type { onRequestHookHandler, RouteShorthandOptions } from 'fastify';

export function get(this: Route<'getId', typeof getConfig>) {
  return true;
}

export const getConfig: RouteShorthandOptions = {};

export function post(
  this: Route<'postId', { onRequest: [...typeof auth, ...typeof auth2] }>
) {
  return true;
}

export const auth = [{} as onRequestHookHandler];
export const auth2 = [{} as onRequestHookHandler];
