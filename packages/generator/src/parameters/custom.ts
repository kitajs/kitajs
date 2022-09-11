import type { Parameter } from "../parameter";
import { ParamData, ParamInfo, ParamResolver } from './base';

export class CustomResolver extends ParamResolver {
  override supports({ typeName, config }: ParamInfo): boolean {
    return !!typeName && !!config.params[typeName];
  }

  override async resolve({
    generics,
    paramName,
    typeName
  }: ParamData): Promise<Parameter | undefined> {
    return {
      value: paramName,
      helper: `const ${paramName} = await ${typeName}.call(context, request, reply, [${
        generics?.map((n) => n.getText()).join(', ') || ''
      }]);`,
    };
  }
}
