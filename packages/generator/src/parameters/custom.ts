import type { Parameter } from '../parameter';
import { ParamData, ParamInfo, ParamResolver } from './base';

export class CustomResolver extends ParamResolver {
  /** Custom resolvers should handle themselves to be serializable if they need to be. */
  static override serializable = true;

  override supports({ typeName, config }: ParamInfo): boolean {
    return !!typeName && !!config.params[typeName];
  }

  override async resolve({
    generics,
    paramName,
    typeName,
    kita
  }: ParamData): Promise<Parameter | undefined> {
    const resolver = kita.config.params[typeName!];
    const transformer = Array.isArray(resolver) && resolver[1].schemaTransformer;

    return {
      value: paramName,

      helper: `const ${paramName} = await ${typeName}.resolver(request, reply${
        !generics ? '' : `, ${generics.map((n) => n.getText()).join(', ')}`
      });`,

      schemaTransformer: transformer ? typeName : undefined,

      schemaTransformerOptions:
        transformer && generics ? generics.map((n) => n.getText()) : undefined
    };
  }
}
