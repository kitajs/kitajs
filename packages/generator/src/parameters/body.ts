import deepmerge from 'deepmerge';
import { KitaError } from '../errors';
import type { Parameter } from '../parameter';
import { ParamData, ParamInfo, ParamResolver } from './base';

export class BodyResolver extends ParamResolver {
  static override serializable = true;

  override supports({ typeName }: ParamInfo): boolean {
    return typeName === 'Body';
  }

  override async resolve({
    route,
    generics,
    inferredType,
    kita
  }: ParamData): Promise<Parameter | undefined> {
    if (route.method === 'GET') {
      throw KitaError(
        `The HTTP specification does not allow the use of Body in GET requests.`,
        route.controllerPath
      );
    }

    // @ts-expect-error - any type is allowed
    if (route.schema.body?.properties) {
      throw KitaError(
        `You cannot have Body and BodyProp in the same route.`,
        route.controllerPath
      );
    }

    if (!generics || generics.length < 1) {
      throw KitaError(`You must specify a type for the Body.`, route.controllerPath);
    }

    const bodyType = generics[0]!;

    route.schema = deepmerge(route.schema, {
      body: await kita.schemaStorage.consumeNode(bodyType)
    });

    return { value: `request.body as ${inferredType}` };
  }
}
