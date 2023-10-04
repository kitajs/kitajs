import type { Path } from '@kitajs/runtime';

export function get(num: Path<number>) {
  return num;
}

export function post(notNum: Path<number, 'num'>) {
  return notNum;
}
