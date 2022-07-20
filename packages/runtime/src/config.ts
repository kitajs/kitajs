import { Rep, Req } from './parameters';
import { RouteContext } from './context';
import { MaybePromise } from './types';

export function kita<T extends RuntimeConfig>(config: T | (() => T)): T {
  return typeof config === 'function' ? config() : config;
}

export type RuntimeConfig = {
  parameterResolvers?: {
    [name: string]: (
      this: RouteContext,
      request: Req,
      reply: Rep,
      parameters: string[]
    ) => MaybePromise<any>;
  };
};