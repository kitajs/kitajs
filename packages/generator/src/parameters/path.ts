import deepmerge from 'deepmerge';
import { ArrayType, Definition } from 'ts-json-schema-generator';
import { KitaError } from '../errors';
import type { Parameter } from '../parameter';
import { unquote } from '../util/string';
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
    if (optional) {
      throw KitaError('Path parameters cannot be optional', route.controllerPath);
    }

    const genericPath = generics?.[1]?.getText();

    const pathName = genericPath ? unquote(genericPath) : paramName;
    const pathType = generics?.[0];

    let jsonSchema: Definition = { type: 'string' };

    if (pathType) {
      // Lookup as a json schema to allow custom primitive types, like (string | number[]), for example.
      const primitive = kita.schemaStorage.asPrimitive(pathType);

      if (!primitive) {
        throw KitaError('Path type must be a primitive type', route.controllerPath);
      }

      if (primitive instanceof ArrayType) {
        throw KitaError(
          'Path type must be a non array primitive type',
          route.controllerPath
        );
      }

      jsonSchema = kita.schemaStorage.getDefinition(primitive);
    }

    route.schema = deepmerge(route.schema, {
      params: {
        type: 'object',
        properties: { [pathName]: jsonSchema },
        required: [pathName],
        additionalProperties: kita.config.schema.generator.additionalProperties
      }
    });

    const type = `{ ['${pathName}']: ${inferredType} }`;
    return { value: `(request.params as ${type})['${pathName}']` };
  }
}
