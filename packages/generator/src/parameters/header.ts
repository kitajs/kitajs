import deepmerge from 'deepmerge';
import type { Parameter } from '../parameter';
import { unquote } from '../util/string';
import { ParamData, ParamInfo, ParamResolver } from './base';

export class HeaderResolver extends ParamResolver {
  static override serializable = true;

  override supports({ typeName }: ParamInfo): boolean {
    return typeName === 'Header';
  }

  override async resolve({
    generics,
    paramName,
    optional,
    route,kita,
    inferredType
  }: ParamData): Promise<Parameter | undefined> {
    const headerNameGeneric = generics?.[0]?.getText();

    const headerName = headerNameGeneric ? unquote(headerNameGeneric) : paramName;

    route.schema = deepmerge(route.schema, {
      headers: {
        type: 'object',
        properties: { [headerName]: { type: 'string' } },
        required: optional ? [] : [headerName],
        additionalProperties: kita.config.schema.generator.additionalProperties
      }
    });

    const type = `{ ['${headerName}']${optional ? '?' : ''}: ${inferredType} }`;
    return { value: `(request.headers as ${type})['${headerName}']` };
  }
}
