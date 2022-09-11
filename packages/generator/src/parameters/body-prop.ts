import deepmerge from 'deepmerge';
import { KitaError } from '../errors';
import type { Parameter } from "../parameter";
import { opt, unquote } from '../util/string';
import { ParamData, ParamInfo, ParamResolver } from './base';

export class BodyPropResolver extends ParamResolver {
  override supports({ typeName }: ParamInfo): boolean {
    return typeName === 'BodyProp';
  }

  override async resolve({
    route,
    optional,
    generics,
    paramName,
    inferredType,
    kita
  }: ParamData): Promise<Parameter | undefined> {
    if (route.method === 'get') {
      throw KitaError(
        `You cannot use Body data in a get request.`,
        route.controllerPath
      );
    }

    // @ts-expect-error - any type is allowed
    if (route.schema.body?.$ref) {
      throw KitaError(
        `You cannot have Body and BodyProp in the same route.`,
        route.controllerPath
      );
    }

    if (!generics || generics.length < 1) {
      throw KitaError(
        `You must specify a type for the BodyProp.`,
        route.controllerPath
      );
    }

    const propType = generics[0]!;
    const propName = generics[1]?.getText();

    if (propName?.includes('.')) {
      throw KitaError(
        `You cannot have dots in the BodyProp name.`,
        route.controllerPath
      );
    }

    const unquoted = propName ? unquote(propName) : paramName;

    route.schema = deepmerge(route.schema, {
      body: {
        type: 'object',
        properties: { [unquoted]: await kita.schemaStorage.consumeNode(propType) },
        required: optional ? [] : [unquoted],
        additionalProperties: false
      }
    });

    const type = `{ ['${unquoted}']${opt(optional)}: ${inferredType} }`;
    return { value: `(request.body as ${type}).${unquoted}` };
  }
}
