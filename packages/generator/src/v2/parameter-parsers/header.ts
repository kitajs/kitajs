import type ts from 'typescript';
import type { KitaConfig } from '../../config';
import type { BaseParameter, BaseRoute } from '../bases';
import { HeaderParameter } from '../parameters/header';
import type { ParameterParser } from '../parsers';
import { mergeSchema } from '../schema/helpers';
import { getParameterName, getParamSafeName, isParamOptional } from '../util/nodes';

export class HeaderParameterParser implements ParameterParser {
  constructor(readonly config: KitaConfig) {}

  supports(param: ts.ParameterDeclaration): boolean | Promise<boolean> {
    return param.type?.getFirstToken()?.getText() === 'Header';
  }

  parse(
    param: ts.ParameterDeclaration,
    index: number,
    route: BaseRoute
  ): BaseParameter | Promise<BaseParameter> {
    const headerName = getParameterName(param, 0);
    const optional = isParamOptional(param);

    mergeSchema(route, {
      headers: {
        type: 'object',
        properties: { [headerName]: { type: 'string' } },
        required: optional ? [] : [headerName],
        additionalProperties: this.config.schema.generator.additionalProperties
      }
    });

    const safeName = getParamSafeName(param, index);

    return new HeaderParameter(safeName);
  }
}
