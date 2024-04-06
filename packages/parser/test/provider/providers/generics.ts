import type { ProviderGenerics } from '@kitajs/runtime';

export interface GenericTest<Num extends number = number, Bool extends boolean = boolean, Str extends string = string> {
  generics: [Num, Bool, Str];
}

export default function (generics: ProviderGenerics<[number, boolean, string]>): GenericTest {
  return { generics };
}
