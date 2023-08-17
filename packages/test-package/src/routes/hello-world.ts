import type { Header } from '@kitajs/runtime';
import { Authorized } from '../providers/authorized';

/** Hello world rest API endpoint. */
export function get(name: Header<'n ame'> = 'world', auth: Authorized): {
  a: 1,
  b: {
    d: [{a:[[[1]]]}]
  }
} {
  return {
    a: 1,
    b: {
      d: [{a:[[[1]]]}]
    }
  };
}
