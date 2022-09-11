import deepmerge from 'deepmerge';
import type { Parameter } from "../parameter";
import { unquote } from '../util/string';
import { ParamInfo, ParamData, ParamResolver } from './base';

export class HeaderResolver extends ParamResolver {
  override supports({ typeName }: ParamInfo): boolean {
    return typeName === 'Header';
  }

  override async resolve({
    generics,
    paramName,
    optional,
    route,
    inferredType
  }: ParamData): Promise<Parameter | undefined> {
    const headerNameGeneric = generics?.[0]?.getText();

    const headerName = headerNameGeneric ? unquote(headerNameGeneric) : paramName;

    route.schema = deepmerge(route.schema, {
      headers: {
        type: 'object',
        properties: { [headerName]: { type: 'string' } },
        required: optional ? [] : [headerName],
        additionalProperties: false
      }
    });

    const type = `{ ['${headerName}']${optional ? '?' : ''}: ${inferredType} }`;
    return { value: `(request.headers as ${type})['${headerName}']` };
  }
}
