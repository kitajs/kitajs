import type { Query } from '@kitajs/runtime';
import type { MyProvider } from '../providers';

export function post(a: Query<string>) {
  return a;
}

export function get(provider: MyProvider) {
  return provider.a === 1;
}
