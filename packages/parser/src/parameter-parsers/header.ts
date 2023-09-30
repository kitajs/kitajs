import { KitaConfig, ParameterParser, Route } from '@kitajs/common';
import type ts from 'typescript';
import { mergeSchema } from '../schema/helpers';
import { kRequestParam } from '../util/constants';
import { getParameterName, getTypeNodeName, isParamOptional } from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class HeaderParameterParser implements ParameterParser {
  /** Headers are present in every type of request */
  agnostic = false;

  constructor(private config: KitaConfig) {}

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'Header';
  }

  parse(param: ts.ParameterDeclaration, route: Route) {
    const name = getParameterName(param, 0);
    const optional = isParamOptional(param);

    mergeSchema(route, {
      headers: {
        type: 'object',
        properties: { [name]: { type: 'string' } },
        required: optional ? [] : [name],
        additionalProperties: this.config.schema.generator.additionalProperties
      }
    });

    return {
      value: buildAccessProperty(kRequestParam, 'headers', name.toLowerCase())
    };
  }
}
