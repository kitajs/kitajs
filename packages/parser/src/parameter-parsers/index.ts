import { KitaConfig, ParameterParser } from '@kitajs/common';
import { KitaParser } from '../parser';
import type { SchemaBuilder } from '../schema/builder';
import { BodyPropParameterParser } from './body-prop';
import { ChainParameterParser } from './chain';
import { ProviderParameterParser } from './custom';
import { FastifyParameterParser } from './fastify';
import { HeaderParameterParser } from './header';
import { QueryParameterParser } from './query';

export function buildParameterParser(config: KitaConfig, schema: SchemaBuilder, parser: KitaParser): ParameterParser {
  const chain = new ChainParameterParser();

  // Adds custom parsers defined by the user
  config.parameterParserAugmentor?.(chain);

  // Adds default parsers
  chain
    .add(new BodyPropParameterParser(config, schema))
    .add(new ProviderParameterParser(parser))
    .add(new FastifyParameterParser())
    .add(new HeaderParameterParser(config))
    .add(new QueryParameterParser(schema, config));

  return chain;
}
