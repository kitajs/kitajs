import type { KitaConfig } from '@kitajs/core';
import type { ts } from '@kitajs/ts-json-schema-generator';
import type { KitaGenerator } from '..//generator';
import { catchKitaError, KitaError } from '../errors';
import type { BaseRoute } from '../routes/base';
import type { Parameter } from '../parameter';

/** Names provided to {@link ParamResolver.supports} predicate. */
export interface ParamInfo {
  /**
   * The param stringified name
   */
  paramName: string;

  /**
   * The param stringified type
   */
  typeName?: string;

  /**
   * The main kita generator
   */
  config: KitaConfig;
}

/**
 * All possible information that a ParamResolver might need.
 */
export interface ParamData<R extends BaseRoute = BaseRoute> {
  /**
   *  The current route info for this parameter
   */
  route: R;

  /**
   * The assigned typescript function declaration
   */
  fn: ts.FunctionDeclaration;

  /**
   * Raw typescript parameter declaration
   */
  param: ts.ParameterDeclaration;

  /**
   * The param stringified name
   */
  paramName: string;

  /**
   * The param stringified type
   */
  typeName?: string;

  /**
   * All possible present generics
   */
  generics?: ts.NodeArray<ts.TypeNode>;

  /**
   * If this parameter was optional

  */
  optional: boolean;

  /**
   * A type string that can be used to get the original parameter type.
   *
   * @example Parameters<typeof Controller.method>[INDEX]
   */
  inferredType: string;

  /**
   * The main kita generator
   */
  kita: KitaGenerator;
}

/**
 * The base parameter resolver is the main way to implement a custom parameter resolver.
 */
export abstract class ParamResolver {
  /** Returns true if this resolver supports this parameter */
  abstract supports(names: ParamInfo): boolean;

  /** Resolves the provided parameter into a {@link Parameter} object. */
  abstract resolve(data: ParamData): Promise<Parameter | undefined>;

  /** All registered resolvers */
  static readonly resolvers: ParamResolver[] = [];

  /** Tries to resolve all parameters for a function. */
  static readonly resolveFunction = async (
    kita: KitaGenerator,
    route: BaseRoute,
    fn: ts.FunctionDeclaration
  ): Promise<Parameter[]> => {
    return (
      Promise.all(
        fn.parameters.map((param, index) => {
          const paramName = param.name.getText().trim();
          const typeName = param.type?.getFirstToken()?.getText();

          const resolver = this.resolvers.find((resolver) =>
            resolver.supports({ paramName, typeName, config: kita.config })
          );

          if (!resolver) {
            throw KitaError(`Unknown parameter ${paramName}.`, route.controllerPath);
          }

          return resolver
            .resolve({
              paramName,
              typeName,
              route,
              fn,
              param,
              generics: (param.type as ts.NodeWithTypeArguments)?.typeArguments,
              optional: !!param.questionToken,
              inferredType: `Parameters<typeof ${route.controllerName}.${route.controllerPath}>[${index}]`,
              kita
            })
            .catch(catchKitaError);
        })
      )
        // Remove undefined values
        .then((params) => params.filter((param): param is Parameter => !!param))
    );
  };
}
