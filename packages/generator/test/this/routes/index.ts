import type { RouteMapper, Use } from '@kitajs/runtime';
import { RouteShorthandOptions } from 'fastify';

export function get(this: Use<typeof handler2>) {
  return 'Hello World!';
}

export function post(this: Use<[typeof handler1, typeof handler2, typeof handler3]>) {
  return 'Hello World!';
}

export const handler1: RouteMapper = function handler1(config) {
  if (!Array.isArray(config.preHandler)) {
    if (config.preHandler) {
      config.preHandler = [config.preHandler];
    } else {
      config.preHandler = [];
    }
  }

  //@ts-expect-error - internal property
  config.handler1 = true;
  config.preHandler.push(function (_, res, next) {
    res.header('x-handler1', 'true');
    return next();
  });

  return config;
};

export const handler2: RouteMapper = function handler2(config) {
  if (!Array.isArray(config.preHandler)) {
    if (config.preHandler) {
      config.preHandler = [config.preHandler];
    } else {
      config.preHandler = [];
    }
  }

  //@ts-expect-error - internal property
  config.handler2 = true;
  config.preHandler.push(function (_, res, next) {
    res.header('x-handler2', 'true');
    return next();
  });

  return config;
};

export function handler3(config: RouteShorthandOptions) {
  if (!Array.isArray(config.preHandler)) {
    if (config.preHandler) {
      config.preHandler = [config.preHandler];
    } else {
      config.preHandler = [];
    }
  }

  //@ts-expect-error - internal property
  config.handler3 = true;
  config.preHandler.push(function (_, res, next) {
    res.header('x-handler3', 'true');
    return next();
  });

  return config;
}
