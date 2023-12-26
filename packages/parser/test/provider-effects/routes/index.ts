import type { ProviderWithEffect } from '../providers';

export function post(effect: ProviderWithEffect) {
  return effect.a;
}
