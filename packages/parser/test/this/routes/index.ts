import type { RouteMapper, Use } from '@kitajs/runtime';

export function get(this: Use<typeof test2>) {
  return 'Hello World!';
}

export function post(this: Use<[typeof test, typeof test2, typeof test3]>) {
  return 'Hello World!';
}

export const test: RouteMapper = function (config) {
  return config;
};

export const test2: RouteMapper = function (config) {
  return config;
};

export const test3: RouteMapper = function (config) {
  return config;
};
