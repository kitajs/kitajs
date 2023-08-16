import ts from 'typescript';
import type { KitaConfig } from '../config';
import { KitaError } from '../errors';
import type { KitaGenerator } from '../generator';
import type { Parameter } from '../parameter';
import type { Route } from '../route';

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
export interface ParamData<R extends Route = Route> {
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
  /**
   * Marks a parameter as a `v8.serializable` standard compatible object.
   */
  public static serializable = false;

  /** Returns true if this resolver supports this parameter */
  abstract supports(names: ParamInfo): boolean;

  /** Resolves the provided parameter into a {@link Parameter} object. */
  abstract resolve(data: ParamData): Promise<Parameter | undefined>;

  /** Tries to resolve all parameters for a function. */
  static readonly resolveParameter = (
    kita: KitaGenerator,
    route: Route,
    fn: ts.FunctionDeclaration,
    param: ts.ParameterDeclaration,
    index: number,
    /** If the selected parameter is valid and can proceed to resolve the parameter */
    predicate?: (res: ParamResolver) => boolean
  ) => {
    const paramName =
      // We may find a parameter with a destructuring pattern or similar syntaxes
      param.name.kind === ts.SyntaxKind.Identifier
        ? param.name.getText().trim()
        : `param${index}`;
    const typeName = param.type?.getFirstToken()?.getText();

    const resolver = kita.params.find((resolver) =>
      resolver.supports({ paramName, typeName, config: kita.config })
    );

    if (!resolver) {
      throw KitaError(`Unknown parameter ${paramName}.`, route.controllerPath);
    }

    if (predicate && !predicate(resolver)) {
      return undefined;
    }

    // This must always appear as the first parameter
    const hasThis = fn.parameters[0]?.name.getText() === 'this';
    const parameterIndex = index - (hasThis ? 1 : 0);

    return resolver.resolve({
      paramName,
      typeName,
      route,
      fn,
      param,
      generics: (param.type as ts.NodeWithTypeArguments)?.typeArguments,
      optional: !!param.questionToken || !!param.initializer,
      inferredType: `Parameters<typeof ${route.controllerName}.${route.controllerMethod}>[${parameterIndex}]`,
      kita
    });
  };
}
