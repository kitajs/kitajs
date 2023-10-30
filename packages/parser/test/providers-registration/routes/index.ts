import { ProviderA } from '../providers/a';
import { ProviderB } from '../providers/b';
import { ProviderC } from '../providers/c';

export function get(a: ProviderA, b: ProviderB) {
  return a + b;
}

export function post(c: ProviderC, a: ProviderA) {
  return c + a;
}
