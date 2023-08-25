import type { KitaConfig, ParameterParser, ProviderParser, RouteParser } from '@kitajs/common';
import type ts from 'typescript';
import type { SchemaBuilder } from '../schema/builder';
import { ChainRouteParser } from '../route-parsers/chain';
import { ChainProviderParser } from './chain';


export function buildProviderParser(
  config: KitaConfig,
  schema: SchemaBuilder,
  paramParser: ParameterParser,
  typeChecker: ts.TypeChecker
): ProviderParser {
  const chain = new ChainProviderParser();

  config.routeParserAugmentor?.(chain);

  // chain.add(new RestRouteParser(config, schema, paramParser, typeChecker));

  return chain;
}
