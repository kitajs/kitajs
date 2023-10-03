import { InvalidParameterUsageError, KitaConfig, Parameter, ParameterParser, Route } from '@kitajs/common';
import { ArrayType, Definition } from 'ts-json-schema-generator';
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

export class PathParameterParser implements ParameterParser {
  agnostic = false;

  constructor(
    private readonly builder: SchemaBuilder,
    private readonly config: KitaConfig
  ) {}

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'Path';
  }

  parse(param: ts.ParameterDeclaration, route: Route): Parameter {
    const optional = isParamOptional(param);

    if (optional) {
      throw new InvalidParameterUsageError('Path', 'Path parameter cannot be optional', toPrettySource(param));
    }

    const name = getParameterName(param, 1);
    const [type] = getParameterGenerics(param);

    let schema: Definition;

    if (type) {
      const primitive = this.builder.toPrimitive(type);

      if (!primitive) {
        throw new InvalidParameterUsageError('Path', 'Path parameter must be a primitive type', toPrettySource(param));
      }

      if (primitive instanceof ArrayType) {
        throw new InvalidParameterUsageError('Path', 'Path parameter cannot be an array', toPrettySource(param));
      }

      schema = this.builder.formatDefinition(primitive);
    } else {
      schema = { type: 'string' };
    }

    mergeSchema(route, {
      params: {
        type: 'object',
        properties: { [name]: schema },
        required: [name],
        additionalProperties: this.config.schema.generator.additionalProperties
      }
    });

    return {
      value: buildAccessProperty(kRequestParam, 'params', name)
    };
  }
}
