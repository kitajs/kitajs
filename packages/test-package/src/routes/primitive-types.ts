import type { Body, Query } from '@kitajs/runtime';

/** primitive complex queries */
export function post(
  body: Body<(string | number)[]>,
  param: Query<string | undefined>,
  parm2: Query<boolean | number | null>
) {
  return true;
}

/** extended queries */
export function get(p: Query<{ a: 1; b: 2 }>) {
  return true;
}
