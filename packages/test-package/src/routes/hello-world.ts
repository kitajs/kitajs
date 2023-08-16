import type { Body, Header } from '@kitajs/runtime';

type CreateDto = { a: number, b?: string }

/** Hello world rest API endpoint. */
export function get(name: Header<'name'> = 'world', body: Body<CreateDto>) {
  return `Hello ${name}!`;
}
