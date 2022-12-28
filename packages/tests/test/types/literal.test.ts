import type { Body, Query } from '@kitajs/runtime';
import { testRoute } from '../setup';

/** post because of body */
export function post(_1: Body<true>, _2: Query<false>, _3: Query<1 | 2>) {
  expect(_1).toBe(true);
  expect(_2).toBe(false);
  expect(_3).toBe(1);
}

testRoute({
  fn: post,
  exports,
  __filename,
  inject: {
    payload: true as any,
    query: {
      _2: 'false',
      _3: '1'
    }
  }
});
