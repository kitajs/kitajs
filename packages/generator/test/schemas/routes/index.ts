import type { Query } from '@kitajs/runtime';

export interface Data {
  /** @default Schema */
  name: string;
}
export function get({ name }: Query<Data>) {
  return `Hello ${name}!`;
}
