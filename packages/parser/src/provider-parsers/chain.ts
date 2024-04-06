import { ChainParser, ProviderResolverNotFound, type Provider, type ProviderParser } from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';

export class ChainProviderParser extends ChainParser<ProviderParser> implements ProviderParser {
  async parse(node: ts.SourceFile): Promise<Provider | undefined> {
    const parser = this.cache.get(node);

    if (!parser) {
      throw new ProviderResolverNotFound(node);
    }

    return parser.parse(node);
  }
}
