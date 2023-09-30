import type { KitaConfig, ParameterParser, RouteParser } from '@kitajs/common';
import type ts from 'typescript';
import type { SchemaBuilder } from '../schema/builder';
import { ChainRouteParser } from './chain';
import { RestRouteParser } from './rest';

export function buildRouteParser(
  config: KitaConfig,
  schema: SchemaBuilder,
  paramParser: ParameterParser,
  typeChecker: ts.TypeChecker
): RouteParser {
  const chain = new ChainRouteParser();

  config.routeParserAugmentor?.(chain);

  chain.add(new RestRouteParser(config, schema, paramParser, typeChecker));

  return chain;
}