import { ProviderD } from './d';

export type ProviderC = 3;

export default function c(d: ProviderD): ProviderC {
  return (d - 1) as 3;
}
