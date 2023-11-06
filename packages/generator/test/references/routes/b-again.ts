//@ts-ignore - runtime may not have been generated yet
import { doB } from '../runtime';

/** @operationId doBAgain */
export function get() {
  return { b: doB() };
}
