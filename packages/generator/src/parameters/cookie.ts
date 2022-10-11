import type { Parameter } from '../parameter';
import { ParamInfo, ParamData, ParamResolver } from './base';

export class CookieResolver extends ParamResolver {
  static override serializable = true;

  override supports({ typeName }: ParamInfo): boolean {
    return typeName === 'Cookie';
  }

  override async resolve({ kita, paramName }: ParamData): Promise<Parameter | undefined> {
    // Include fastify cookie type definitions
    kita.ast.addImport(`import '@fastify/cookie';`);

    return { value: `request.cookies?.${paramName}` };
  }
}
