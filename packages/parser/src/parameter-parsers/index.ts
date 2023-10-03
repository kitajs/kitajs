import { KitaConfig, KitaParser, ParameterParser } from '@kitajs/common';
import type { SchemaBuilder } from '../schema/builder';
import { BodyPropParameterParser } from './body-prop';
import { ChainParameterParser } from './chain';
import { CookieParameterParser } from './cookie';
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
    .add(new FastifyParameterParser())
    .add(new QueryParameterParser(schema, config))
    .add(new BodyPropParameterParser(config, schema))
    .add(new ProviderParameterParser(parser))
    .add(new HeaderParameterParser(config))
    .add(new CookieParameterParser());

  return chain;
}
