import type { Path } from '@kitajs/runtime';

export function get(name: Path, num: Path<number>) {
  return { name, num };
}

export function post(notName: Path<string, 'name'>, notNum: Path<number, 'num'>) {
  return { notName, notNum };
}
