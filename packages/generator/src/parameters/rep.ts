import type { Parameter } from '../parameter';
import { ParamData, ParamInfo, ParamResolver } from './base';

export class RepResolver extends ParamResolver {
  override supports({ typeName }: ParamInfo): boolean {
    return typeName === 'Rep';
  }

  override async resolve({}: ParamData): Promise<Parameter | undefined> {
    return { value: 'reply' };
  }
}
