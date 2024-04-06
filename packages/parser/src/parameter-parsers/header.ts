import { kRequestParam, type KitaConfig, type ParameterParser, type Route } from '@kitajs/common';
import type { ts } from 'ts-json-schema-generator';
import { mergeSchema } from '../schema/helpers';
import { getParameterName, getTypeNodeName, isParamOptional } from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class HeaderParameterParser implements ParameterParser {
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
        additionalProperties: this.config.generatorConfig.additionalProperties
      }
    });

    return {
      name: HeaderParameterParser.name,
      value: buildAccessProperty(kRequestParam, 'headers', name.toLowerCase())
    };
  }
}
