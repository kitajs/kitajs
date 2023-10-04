import type { Path } from '@kitajs/runtime';

export function get(name: Path) {
  return name;
}

export function post(notName: Path<string, 'name'>) {
  return notName;
}
