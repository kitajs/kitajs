import type { Parameter } from '../parameter';
import { ParamData, ParamInfo, ParamResolver } from './base';

export class ReqResolver extends ParamResolver {
  override supports({ typeName }: ParamInfo): boolean {
    return typeName === 'Req';
  }

  override async resolve({
    route,
    inferredType
  }: ParamData): Promise<Parameter | undefined> {
    return {
      value: 'websocket' in route ? `request as ${inferredType}` : 'request'
    };
  }
}
