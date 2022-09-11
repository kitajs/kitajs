import deepmerge from 'deepmerge';
import type { Parameter } from "../parameter";
import { unquote } from '../util/string';
import { ParamInfo, ParamData, ParamResolver } from './base';

export class PathResolver extends ParamResolver {
  override supports({ typeName }: ParamInfo): boolean {
    return typeName === 'Path';
  }

  override async resolve({
    generics,
    paramName,
    inferredType,
    route,
    optional
  }: ParamData): Promise<Parameter | undefined> {
    const generic = generics?.[0]?.getText();
    const pathName = generic ? unquote(generic) : paramName;

    route.schema = deepmerge(route.schema, {
      params: {
        type: 'object',
        properties: { [pathName]: { type: 'string' } },
        required: optional ? [] : [pathName],
        additionalProperties: false
      }
    });

    const type = `{ ['${pathName}']${optional ? '?' : ''}: ${inferredType} }`;
    return { value: `(request.params as ${type})['${pathName}']` };
  }
}
