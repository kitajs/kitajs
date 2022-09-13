import { KitaError } from '../errors';
import type { Parameter } from '../parameter';
import type { WebsocketRoute } from '../routes/websocket';
import { ParamData, ParamInfo, ParamResolver } from './base';

export class SockResolver extends ParamResolver {
  override supports({ typeName }: ParamInfo): boolean {
    return typeName === 'Sock';
  }

  override async resolve({
    route
  }: ParamData<WebsocketRoute>): Promise<Parameter | undefined> {
    if (!route.websocket) {
      throw KitaError(
        `The Conn parameter is only available for websocket routes.`,
        route.controllerPath
      );
    }

    return { value: `connection.socket` };
  }
}
