import { Test } from '../providers/test';
import { Transformer } from '../providers/transformer';

export function get(test: Test) {
  return test.a;
}
export function post(test: Transformer) {
  return test.b;
}
