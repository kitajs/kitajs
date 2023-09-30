import {
  BodyInGetRequestError,
  InvalidParameterUsageError,
  KitaConfig,
  Parameter,
  ParameterConflictError,
  ParameterParser,
  Route
} from '@kitajs/common';
import type ts from 'typescript';
import type { SchemaBuilder } from '../schema/builder';
import { mergeSchema } from '../schema/helpers';
import { getParameterGenerics, getParameterName, isParamOptional } from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class BodyPropParameterParser implements ParameterParser {
  /** Only on known routes */
  agnostic = false;

  constructor(readonly config: KitaConfig, readonly schema: SchemaBuilder) {}

  supports(param: ts.ParameterDeclaration) {
    return param.type?.getFirstToken()?.getText() === 'BodyProp';
  }

  async parse(param: ts.ParameterDeclaration, route: Route): Promise<Parameter> {
    if (route.method === 'GET') {
      throw new BodyInGetRequestError(route.controllerPrettyPath);
    }

    // The $ref property is set when using the Body parameter
    if (route.schema.body?.$ref) {
      throw new ParameterConflictError('Body', 'BodyProp', route.schema.body);
    }

    const [type] = getParameterGenerics(param);

    if (!type) {
      throw new InvalidParameterUsageError('BodyProp', 'You must specify a type for the BodyProp parameter.');
    }

    const name = getParameterName(param, 1);

    if (name.includes('.')) {
      throw new InvalidParameterUsageError(
        'BodyProp',
        `You cannot have dots in the BodyProp name.
         Use the Body parameter for deep objects.`
      );
    }

    const optional = isParamOptional(param);

    mergeSchema(route, {
      body: {
        type: 'object',
        properties: { [name]: await this.schema.consumeNodeSchema(type) },
        required: optional ? [] : [name],
        additionalProperties: this.config.schema.generator.additionalProperties
      }
    });

    return {
      value: buildAccessProperty('request', 'body', name)
    };
  }
}
