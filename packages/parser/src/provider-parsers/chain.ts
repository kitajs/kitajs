import { ChainParser, Provider, ProviderParser, ProviderResolverNotFound } from '@kitajs/common';
import type ts from 'typescript';
import { toPrettySource } from '../util/nodes';

export class ChainProviderParser extends ChainParser<ProviderParser> implements ProviderParser {
  async parse(node: ts.Node): Promise<Provider> {
    const parser = super.cache.get(node);

    if (!parser) {
      throw new ProviderResolverNotFound(toPrettySource(node));
    }

    return parser.parse(node);
  }
}
