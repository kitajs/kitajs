import { KitaError } from '../errors';
import type { WebsocketRoute } from '../routes/websocket';
import type { Parameter } from "../parameter";
import { ParamData, ParamInfo, ParamResolver } from './base';

export class ConnResolver extends ParamResolver {
  override supports({ typeName }: ParamInfo): boolean {
    return typeName === 'Conn';
  }

  override async resolve({
    route,
    inferredType
  }: ParamData<WebsocketRoute>): Promise<Parameter | undefined> {
    if (!route.websocket) {
      throw KitaError(
        `The Conn parameter is only available for websocket routes.`,
        route.controllerPath
      );
    }

    return { value: `connection as ${inferredType}` };
  }
}
