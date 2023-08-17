import type { KitaConfig } from '../../config';
import { Kita } from '../kita';
import type { ParameterParser } from '../parsers';
import type { SchemaBuilder } from '../schema/builder';
import { BodyPropParameterParser } from './body-prop';
import { ChainParameterParser } from './chain';
import { ProviderParameterParser } from './custom';
import { FastifyParameterParser } from './fastify';
import { HeaderParameterParser } from './header';

export function buildParameterParser(config: KitaConfig, schema: SchemaBuilder, kita: Kita): ParameterParser {
  const chain = new ChainParameterParser();

  // Adds custom parsers defined by the user
  config.parameterParserAugmentor?.(chain);

  // Adds default parsers
  chain
    .addParser(new BodyPropParameterParser(config, schema))
    .addParser(new ProviderParameterParser(kita))
    .addParser(new FastifyParameterParser())
    .addParser(new HeaderParameterParser(config));

  return chain;
}
