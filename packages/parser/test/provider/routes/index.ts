import { GenericTest } from '../providers/generics';
import { Test } from '../providers/test';
import { Transformer } from '../providers/transformer';

export function get(test: Test) {
  return test.a;
}

export function post(test: Transformer) {
  return test.b;
}

export function put(test: GenericTest<123, false, 'Hello'>) {
  return test.generics;
}
