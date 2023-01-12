import type { CustomParameter } from '@kitajs/runtime';

export type RandomNumber = CustomParameter<number, []>;

export default function (): RandomNumber {
  return Math.random();
}
