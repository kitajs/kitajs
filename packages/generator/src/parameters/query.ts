import deepmerge from 'deepmerge';
import { ts } from '@kitajs/ts-json-schema-generator';
import { KitaError } from '../errors';
import type { Parameter } from "../parameter";
import { unquote } from '../util/string';
import { ParamData, ParamInfo, ParamResolver } from './base';

export class QueryResolver extends ParamResolver {
  override supports({ typeName }: ParamInfo): boolean {
    return typeName === 'Query';
  }

  override async resolve({
    generics = ts.factory.createNodeArray(),
    route,
    inferredType,
    kita,
    paramName,
    optional
  }: ParamData): Promise<Parameter | undefined> {
    const name = generics[1] ? unquote(generics[1].getText()) : paramName;
    const firstGenerics = generics[0]?.getText();

    // raw type
    if (
      !generics[0] ||
      firstGenerics === 'number' ||
      firstGenerics === 'string' ||
      firstGenerics === 'boolean'
    ) {
      // @ts-expect-error - any type is allowed
      if (route.schema.querystring?.$ref) {
        throw KitaError(
          `You cannot have a named and a extended query object in the same method`,
          route.controllerPath
        );
      }

      const queryType = firstGenerics ?? 'string';

      route.schema = deepmerge(route.schema, {
        querystring: {
          type: 'object',
          properties: { [name]: { type: queryType } },
          required: optional ? [] : [name],
          additionalProperties: false
        }
      });

      const type = `{ ['${name}']${optional ? '?' : ''}: ${queryType} }`;
      return { value: `(request.query as ${type})['${name}']` };
    }

    // @ts-expect-error - any type is allowed
    if (route.schema.querystring?.properties) {
      throw KitaError(
        `You cannot have a named and a extended query object in the same method`,
        route.controllerPath
      );
    }

    // @ts-expect-error - any type is allowed
    if (route.schema.querystring?.$ref) {
      throw KitaError(
        `You cannot have more than one extended query object in the same method`,
        route.controllerPath
      );
    }

    route.schema = deepmerge(route.schema, {
      querystring: await kita.schemaStorage.consumeNode(generics[0]!)
    });

    return { value: `(request.query as ${inferredType})` };
  }
}
