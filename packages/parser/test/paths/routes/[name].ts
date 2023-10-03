import type { Path } from '@kitajs/common';

export function get(name: Path) {
  return name;
}

export function post(notName: Path<string, 'name'>) {
  return notName;
}
