import {
  InvalidParameterUsageError,
  KitaConfig,
  Parameter,
  ParameterParser,
  Route,
  kRequestParam
} from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';
import { ArrayType, Definition } from 'ts-json-schema-generator';
import { SchemaBuilder } from '../schema/builder';
import { mergeSchema } from '../schema/helpers';
import { getParameterGenerics, getParameterName, getTypeNodeName, isParamOptional } from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class PathParameterParser implements ParameterParser {
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
      throw new InvalidParameterUsageError('Path parameter cannot be optional', param.type || param);
    }

    const name = getParameterName(param, 1);
    const [type] = getParameterGenerics(param);

    let schema: Definition;

    if (type) {
      const primitive = this.builder.toPrimitive(type);

      if (!primitive) {
        throw new InvalidParameterUsageError('Path parameter must be a primitive type', param.type || param);
      }

      if (primitive instanceof ArrayType) {
        throw new InvalidParameterUsageError('Path parameter cannot be an array', param.type || param);
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
        additionalProperties: this.config.generatorConfig.additionalProperties
      }
    });

    return {
      value: buildAccessProperty(kRequestParam, 'params', name)
    };
  }
}
