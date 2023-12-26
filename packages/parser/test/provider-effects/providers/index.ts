import type { Body } from '@kitajs/runtime';

export interface ProviderWithEffect {
  a: 1;
}

export default function (data: Body<{ a: 1 }>): ProviderWithEffect {
  return data;
}
