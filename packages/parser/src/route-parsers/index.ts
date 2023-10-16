import type { KitaConfig, ParameterParser, RouteParser } from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';
import type { SchemaBuilder } from '../schema/builder';
import { ChainRouteParser } from './chain';
import { HtmlRouteParser } from './html';
import { RestRouteParser } from './rest';

export function buildRouteParser(
  config: KitaConfig,
  schema: SchemaBuilder,
  paramParser: ParameterParser,
  typeChecker: ts.TypeChecker
): RouteParser {
  const chain = new ChainRouteParser();

  config.routeParserAugmentor?.(chain);

  chain
    .add(new HtmlRouteParser(config, paramParser, typeChecker, schema))
    .add(new RestRouteParser(config, schema, paramParser, typeChecker));

  return chain;
}
