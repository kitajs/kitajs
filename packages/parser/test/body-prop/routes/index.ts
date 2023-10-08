import type { BodyProp } from '@kitajs/runtime';

export interface Type {
  b: number;
}

export function post(
  name: BodyProp<string>,
  a: BodyProp<{ a: number }>,
  type: BodyProp<Type>,
  custom: BodyProp<number, 'type 2'>
) {
  return {
    name,
    a,
    type,
    custom
  };
}
