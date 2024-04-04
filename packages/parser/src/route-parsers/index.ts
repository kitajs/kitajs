import type { AstCollector, KitaConfig, ParameterParser, RouteParser } from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';
import type { SchemaBuilder } from '../schema/builder';
import { ChainRouteParser } from './chain';
import { HtmlRouteParser } from './html';
import { RestRouteParser } from './rest';

export function buildRouteParser(
  config: KitaConfig,
  schema: SchemaBuilder,
  paramParser: ParameterParser,
  typeChecker: ts.TypeChecker,
  collector: AstCollector
): RouteParser {
  const chain = new ChainRouteParser();

  config.routeParserAugmentor?.(chain);

  chain
    .add(new HtmlRouteParser(config, paramParser, typeChecker, schema, collector))
    .add(new RestRouteParser(config, schema, paramParser, typeChecker, collector));

  return chain;
}
