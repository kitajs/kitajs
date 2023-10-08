import type { Header } from '@kitajs/runtime';

export function get(name: Header, age: Header<'age', number>, type?: Header<'custom name', string>) {
  return `Hello ${name} ${age} ${type}!`;
}
