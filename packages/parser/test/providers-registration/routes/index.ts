import type { ProviderA } from '../providers/a';
import type { ProviderB } from '../providers/b';
import type { ProviderC } from '../providers/c';

export function get(a: ProviderA, b: ProviderB) {
  return a + b;
}

export function post(c: ProviderC, a: ProviderA) {
  return c + a;
}
