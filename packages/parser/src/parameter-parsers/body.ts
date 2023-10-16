import {
  BodyInGetRequestError,
  InvalidParameterUsageError,
  ParameterConflictError,
  ParameterParser,
  Route,
  kRequestParam
} from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';
import type { SchemaBuilder } from '../schema/builder';
import { mergeSchema } from '../schema/helpers';
import { getParameterGenerics, getTypeNodeName } from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class BodyParameterParser implements ParameterParser {
  constructor(private schema: SchemaBuilder) {}

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'Body';
  }

  parse(param: ts.ParameterDeclaration, route: Route) {
    if (route.method === 'GET') {
      throw new BodyInGetRequestError(param.type || param);
    }

    // Properties are defined when using the BodyProp parameter
    if (route.schema.body?.properties) {
      throw new ParameterConflictError('BodyProp', 'Body', param.type || param);
    }

    const [type] = getParameterGenerics(param);

    if (!type) {
      throw new InvalidParameterUsageError('You must specify a type for the Body parameter.', param.type || param);
    }

    mergeSchema(route, {
      body: this.schema.consumeNodeSchema(type)
    });

    return {
      value: buildAccessProperty(kRequestParam, 'body')
    };
  }
}
