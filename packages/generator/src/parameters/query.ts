import deepmerge from 'deepmerge';
import { ts } from 'ts-json-schema-generator';
import { KitaError } from '../errors';
import type { Parameter } from '../parameter';
import type { SchemaStorage } from '../schema-storage';
import { unquote } from '../util/string';
import { ParamData, ParamInfo, ParamResolver } from './base';

export class QueryResolver extends ParamResolver {
  static override serializable = true;

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
      simple,
      definition
    } = this.findNameAndType(generics, paramName, kita.schemaStorage);

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
          properties: { [queryName]: definition },
          required: optional ? [] : [queryName],
          additionalProperties: kita.config.schema.generator.additionalProperties
        }
      });

      const type = `{ ['${queryName}']${optional ? '?' : ''}: ${inferredType} }`;
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

  findNameAndType(
    generics: ts.NodeArray<ts.TypeNode>,
    paramName: string,
    schemaStorage: SchemaStorage
  ) {
    if (!generics[0]) {
      return {
        name: paramName,
        simple: true,
        definition: {
          type: 'string'
        }
      };
    }

    // Lookup as a json schema to allow custom primitive types, like (string | number[])[], for example.
    const primitive = schemaStorage.asPrimitive(generics[0]);

    return {
      name: !generics[1] ? paramName : unquote(generics[1].getText()),
      simple: !!primitive,
      definition: primitive
        ? schemaStorage.getDefinition(primitive)
        : schemaStorage.consumeNode(generics[0]!)
    };
  }
}
