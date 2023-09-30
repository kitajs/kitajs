import {
  InvalidParameterUsageError,
  KitaConfig,
  Parameter,
  ParameterConflictError,
  ParameterParser,
  QueryMixError,
  Route
} from '@kitajs/common';
import { StringType } from 'ts-json-schema-generator';
import type ts from 'typescript';
import { SchemaBuilder } from '../schema/builder';
import { mergeSchema } from '../schema/helpers';
import { kRequestParam } from '../util/constants';
import {
  getParameterGenerics,
  getParameterName,
  getTypeNodeName,
  isParamOptional,
  toPrettySource
} from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class QueryParameterParser implements ParameterParser {
  /** Query needs a route to apply the generated schema */
  agnostic = true;

  constructor(private schemaBuilder: SchemaBuilder, private config: KitaConfig) {}

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'Query';
  }

  parse(param: ts.ParameterDeclaration, route: Route, _node: ts.FunctionDeclaration, _index: number): Parameter {
    const [type, genericName] = getParameterGenerics(param);

    const primitiveType = type === undefined ? new StringType() : this.schemaBuilder.toPrimitive(type);

    // Simple primitive parameter, can be grouped with other Query parameters
    if (primitiveType) {
      if (route.schema.querystring?.$ref) {
        throw new QueryMixError(toPrettySource(param));
      }

      const optional = isParamOptional(param);
      const name = getParameterName(param, 1);

      mergeSchema(route, {
        querystring: {
          type: 'object',
          properties: { [name]: this.schemaBuilder.formatDefinition(primitiveType) },
          required: optional ? [] : [name],
          additionalProperties: this.config.schema.generator.additionalProperties
        }
      });

      return {
        value: buildAccessProperty(kRequestParam, 'query', name)
      };
    }

    if (genericName) {
      throw new InvalidParameterUsageError(
        'Query',
        'You cannot give a name to a complex query object',
        toPrettySource(param)
      );
    }

    // Already used a query primitive query parameter
    if (route.schema.querystring?.properties) {
      throw new QueryMixError(toPrettySource(param));
    }

    // Already used a query extended query parameter
    if (route.schema.querystring?.$ref) {
      throw new ParameterConflictError('Query<{...}>', 'Query<{...}>', route.schema.querystring);
    }

    mergeSchema(route, {
      querystring: this.schemaBuilder.consumeNodeSchema(type!)
    });

    return {
      value: buildAccessProperty(kRequestParam, 'query')
    };
  }
}
