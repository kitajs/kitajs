import type ts from 'typescript';
import type { KitaConfig } from '../../config';
import type { BaseParameter, BaseRoute } from '../models';
import { HeaderParameter } from '../parameters/header';
import type { ParameterParser } from '../parsers';
import { mergeSchema } from '../schema/helpers';
import { getParameterName, isParamOptional } from '../util/nodes';

export class HeaderParameterParser implements ParameterParser {
  constructor(readonly config: KitaConfig) {}

  supports(param: ts.ParameterDeclaration): boolean | Promise<boolean> {
    return param.type?.getFirstToken()?.getText() === 'Header';
  }

  parse(
    param: ts.ParameterDeclaration,
    route: BaseRoute
  ): BaseParameter | Promise<BaseParameter> {
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

    return new HeaderParameter(name);
  }
}
