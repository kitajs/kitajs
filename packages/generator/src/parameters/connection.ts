import { KitaError } from '../errors';
import type { Parameter } from '../parameter';
import type { WebsocketRoute } from '../route';
import { ParamData, ParamInfo, ParamResolver } from './base';

export class ConnResolver extends ParamResolver {
  override supports({ typeName }: ParamInfo): boolean {
    return typeName === 'Connection';
  }

  override async resolve({
    route,
    inferredType
  }: ParamData<WebsocketRoute>): Promise<Parameter | undefined> {
    if (!route.websocket) {
      throw KitaError(
        `The Connection parameter is only available for websocket routes.`,
        route.controllerPath
      );
    }

    return { value: `connection as ${inferredType}` };
  }
}
