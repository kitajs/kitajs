import type { GenericTest } from '../providers/generics';
import type { Test } from '../providers/test';
import type { Transformer } from '../providers/transformer';

export function get(test: Test) {
  return test.a;
}

export function post(test: Transformer) {
  return test.b;
}

export function put(test: GenericTest<123, false, 'Hello'>) {
  return test.generics;
}
