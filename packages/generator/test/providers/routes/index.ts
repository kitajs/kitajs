import { MyProvider } from '../providers/a';
import { GenericTest } from '../providers/generics';

/** Default desc */
export function get(test: MyProvider) {
  return test;
}

export function post(t: GenericTest<1>) {
  return t;
}
