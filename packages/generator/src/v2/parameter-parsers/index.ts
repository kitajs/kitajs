import type { KitaConfig } from '../../config';
import type { ParameterParser } from '../parsers';
import type { SchemaBuilder } from '../schema/builder';
import { BodyPropParameterParser } from './body-prop';
import { ChainParameterParser } from './chain';
import { HeaderParameterParser } from './header';

export function buildParameterParser(
  config: KitaConfig,
  schema: SchemaBuilder
): ParameterParser {
  const chain = new ChainParameterParser();

  config.parameterParserAugmentor?.(chain);

  chain
    .addParser(new BodyPropParameterParser(config, schema))
    .addParser(new HeaderParameterParser(config));

  return chain;
}
