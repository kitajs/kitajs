import type { KitaConfig, ParameterParser, ProviderParser } from '@kitajs/common';
import ts from 'typescript';
import { SchemaBuilder } from '../schema/builder';
import { ChainProviderParser } from './chain';
import { DefaultProviderParser } from './default';
import { SchemasProviderParser } from './schema';

export function buildProviderParser(
  config: KitaConfig,
  paramParser: ParameterParser,
  checker: ts.TypeChecker,
  schema: SchemaBuilder
): ProviderParser {
  const chain = new ChainProviderParser();

  config.providerParserAugmentor?.(chain);

  chain.add(new SchemasProviderParser(checker, schema));
  chain.add(new DefaultProviderParser(paramParser, config));

  return chain;
}
