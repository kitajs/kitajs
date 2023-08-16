import type ts from 'typescript';
import type { KitaConfig } from '../../config';
import type { ParameterParser, RouteParser } from '../parsers';
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

  chain.addParser(new RestRouteParser(config, schema, paramParser, typeChecker));

  return chain;
}
