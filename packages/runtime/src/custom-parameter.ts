import type { RouteContext } from './context';
import type { CustomParameter, Rep, Req } from './parameters';
import type { MaybePromise, Native } from './types';
import type { KitaCpp } from './internal';

export function customParameter<C extends CustomParameter<unknown, Native[]> = never>(
  fn: (
    this: RouteContext,
    request: Req,
    reply: Rep,
    parameters: C[KitaCpp]
  ) => MaybePromise<C extends CustomParameter<infer R, Native[]> ? R : 'type error'>
) {
  return fn;
}
