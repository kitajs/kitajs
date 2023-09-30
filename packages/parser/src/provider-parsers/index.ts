import type { KitaConfig, ParameterParser, ProviderParser } from '@kitajs/common';
import { ChainProviderParser } from './chain';
import { DefaultProviderParser } from './default';

export function buildProviderParser(config: KitaConfig, paramParser: ParameterParser): ProviderParser {
  const chain = new ChainProviderParser();

  config.providerParserAugmentor?.(chain);

  chain.add(new DefaultProviderParser(paramParser));

  return chain;
}
