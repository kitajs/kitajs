import {
  BodyInGetRequestError,
  InvalidParameterUsageError,
  KitaConfig,
  ParameterConflictError,
  ParameterParser,
  Route,
  kRequestParam
} from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';
import type { SchemaBuilder } from '../schema/builder';
import { mergeSchema } from '../schema/helpers';
import { getParameterGenerics, getParameterName, getTypeNodeName, isParamOptional } from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class BodyPropParameterParser implements ParameterParser {
  constructor(
    private config: KitaConfig,
    private schema: SchemaBuilder
  ) {}

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'BodyProp';
  }

  parse(param: ts.ParameterDeclaration, route: Route) {
    if (route.method === 'GET') {
      throw new BodyInGetRequestError(param.type || param);
    }

    // The $ref property is set when using the Body parameter
    if (route.schema.body?.$ref) {
      throw new ParameterConflictError('Body', 'BodyProp', param.type || param);
    }

    const [type] = getParameterGenerics(param);

    if (!type) {
      throw new InvalidParameterUsageError('You must specify a type for the BodyProp parameter.', param.type || param);
    }

    const name = getParameterName(param, 1);

    if (name.includes('.')) {
      throw new InvalidParameterUsageError(
        'You cannot have dots in the BodyProp name. Use the Body parameter for deep objects.',
        param.type || param
      );
    }

    const optional = isParamOptional(param);

    mergeSchema(route, {
      body: {
        type: 'object',
        properties: { [name]: this.schema.consumeNodeSchema(type) },
        required: optional ? [] : [name],
        additionalProperties: this.config.generatorConfig.additionalProperties
      }
    });

    return {
      value: buildAccessProperty(kRequestParam, 'body', name)
    };
  }
}
