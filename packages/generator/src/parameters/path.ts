import deepmerge from 'deepmerge';
import { ArrayType, Context, Definition } from 'ts-json-schema-generator';
import { KitaError } from '../errors';
import type { Parameter } from '../parameter';
import { unquote } from '../util/string';
import { asPrimitiveType } from '../util/type';
import { ParamData, ParamInfo, ParamResolver } from './base';

export class PathResolver extends ParamResolver {
  static override serializable = true;

  override supports({ typeName }: ParamInfo): boolean {
    return typeName === 'Path';
  }

  override async resolve({
    generics,
    paramName,
    inferredType,
    route,
    optional,
    kita
  }: ParamData): Promise<Parameter | undefined> {
    const generic = generics?.[0]?.getText();
    const pathName = generic ? unquote(generic) : paramName;

    let jsonSchema: Definition = { type: 'string' };
    const pathGenericType = generics?.[1];

    if (pathGenericType) {
      // Lookup as a json schema to allow custom primitive types, like (string | number[]), for example.
      const primitive = asPrimitiveType(
        kita.schemaStorage.nodeParser.createType(
          pathGenericType,
          new Context(pathGenericType)
        )
      );

      if (!primitive || primitive instanceof ArrayType) {
        throw KitaError('Path type must be a non array literal', route.controllerPath);
      }

      jsonSchema = kita.schemaStorage.typeFormatter.getDefinition(primitive);
    }

    route.schema = deepmerge(route.schema, {
      params: {
        type: 'object',
        properties: { [pathName]: jsonSchema },
        required: optional ? [] : [pathName],
        additionalProperties: false
      }
    });

    const type = `{ ['${pathName}']${optional ? '?' : ''}: ${inferredType} }`;
    return { value: `(request.params as ${type})['${pathName}']` };
  }
}
