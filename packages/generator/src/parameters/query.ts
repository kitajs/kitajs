import { ts } from '@kitajs/ts-json-schema-generator';
import deepmerge from 'deepmerge';
import { KitaError } from '../errors';
import type { Parameter } from '../parameter';
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
    const {
      name: queryName,
      type: queryType,
      simple
    } = this.findNameAndType(generics, paramName);

    if (simple) {
      // @ts-expect-error - any type is allowed
      if (route.schema.querystring?.$ref) {
        throw KitaError(
          `You cannot have a named and a extended query object in the same method`,
          [paramName, route.controllerPath]
        );
      }

      route.schema = deepmerge(route.schema, {
        querystring: {
          type: 'object',
          properties: { [queryName]: { type: queryType } },
          required: optional ? [] : [queryName],
          additionalProperties: false
        }
      });

      const type = `{ ['${queryName}']${optional ? '?' : ''}: ${queryType} }`;
      return { value: `(request.query as ${type})['${queryName}']` };
    }

    // @ts-expect-error - any type is allowed
    if (route.schema.querystring?.properties) {
      throw KitaError(
        `You cannot have a named and a extended query object in the same method`,
        [paramName, route.controllerPath]
      );
    }

    // @ts-expect-error - any type is allowed
    if (route.schema.querystring?.$ref) {
      throw KitaError(
        `You cannot have more than one extended query object in the same method`,
        [paramName, route.controllerPath]
      );
    }

    route.schema = deepmerge(route.schema, {
      querystring: await kita.schemaStorage.consumeNode(generics[0]!)
    });

    return { value: `(request.query as ${inferredType})` };
  }

  findNameAndType(generics: ts.NodeArray<ts.TypeNode>, paramName: string) {
    if (!generics[0]) {
      return { name: paramName, type: 'string', simple: true };
    }

    if (generics[0].getText().match(/^['`"]/g)) {
      return { name: unquote(generics[0].getText()), type: 'string', simple: true };
    }

    const simple = generics[0].getText().match(/^(string|number|boolean)$/);

    if (!generics[1]) {
      return {
        name: paramName,
        type: generics[0].getText(),
        simple
      };
    }

    return { name: unquote(generics[1].getText()), type: generics[0].getText(), simple };
  }
}
