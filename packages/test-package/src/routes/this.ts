import type { Route } from '@kitajs/runtime';
import type { onRequestHookHandler, RouteShorthandOptions } from 'fastify';

const onRequest: onRequestHookHandler = (_, __, next) => {
  console.log('onRequest called');
  return next();
};

//

export function get(this: Route<'getId', typeof getConfig>) {
  return true;
}

export const getConfig: RouteShorthandOptions = { onRequest };

//

export function post(
  this: Route<'withSubTypeofs', { onRequest: [...typeof auth, ...typeof auth2] }>
) {
  return true;
}

export const auth = [onRequest];
export const auth2 = [onRequest];
