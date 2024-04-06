import {
  InvalidParameterUsageError,
  type Parameter,
  type ParameterParser,
  type Route,
  RouteMapperNotExportedError,
  RouteOptionsAlreadyDefinedError,
  kControllerName
} from '@kitajs/common';
import { ts } from 'ts-json-schema-generator';
import {
  getParameterGenerics,
  getTypeName,
  getTypeNodeName,
  isExportedFunction,
  isExportedVariable
} from '../util/nodes';

export class ThisParameterParser implements ParameterParser {
  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'Use' || getTypeName(param) === 'this';
  }

  parse(param: ts.ParameterDeclaration, route: Route, fn: ts.FunctionDeclaration, index: number): Parameter {
    const isThis = getTypeName(param) === 'this' && index === 0;
    const isUse = getTypeNodeName(param) === 'Use';

    // other parameter with Use type
    if (!isThis && isUse) {
      throw new InvalidParameterUsageError(
        'The `Use<>` parameter can only be bound to the `this` keyword.',
        param.type || param
      );
    }

    // this parameter with other type
    if (!isUse && isThis) {
      throw new InvalidParameterUsageError(
        'The `this` parameter can only be used with the `Use<>` type.',
        param.type || param
      );
    }

    const [config] = getParameterGenerics(param);

    if (!config) {
      throw new InvalidParameterUsageError(
        'The `this` parameter must be used with a configuration type.',
        param.type || param
      );
    }

    if (!ts.isTypeQueryNode(config) && !ts.isTupleTypeNode(config)) {
      throw new InvalidParameterUsageError(
        'The `this` parameter must be used `typeof` reference or a literal tuple of `typeof` references',
        param.type || param
      );
    }

    if (route.options) {
      throw new RouteOptionsAlreadyDefinedError(fn.name || fn);
    }

    // Single typeof reference
    if (ts.isTypeQueryNode(config)) {
      const type = config.exprName.getText().trim();

      // Checks if the file exports the mapper
      if (
        !fn.getSourceFile().statements.find(
          (s) =>
            // export function
            (isExportedFunction(s) && s.name?.getText().trim() === type) ||
            // export const/let/var
            (isExportedVariable(s) && s.declarationList.declarations[0]?.name.getText().trim() === type)
        )
      ) {
        throw new RouteMapperNotExportedError(config);
      }

      route.options = `${kControllerName}.${type}($1)`;

      return {
        name: ThisParameterParser.name,
        value: '',
        ignore: true
      };
    }

    // Maps all typeof references
    for (const element of config.elements) {
      if (!ts.isTypeQueryNode(element)) {
        throw new InvalidParameterUsageError(
          'The `this` parameter must only have `typeof` references inside its tuple.',
          param.type || param
        );
      }

      const type = element.exprName.getText().trim();

      // Checks if the file exports the mapper
      if (
        !fn.getSourceFile().statements.find(
          (s) =>
            // export function
            (isExportedFunction(s) && s.name?.getText().trim() === type) ||
            // export const/let/var
            (isExportedVariable(s) && s.declarationList.declarations[0]?.name.getText().trim() === type)
        )
      ) {
        throw new RouteMapperNotExportedError(config);
      }

      if (!route.options) {
        route.options = '$1';
      }

      route.options = `${kControllerName}.${type}(${route.options})`;
    }

    // This parameter is synthetic, so this result will not be used.
    return {
      name: ThisParameterParser.name,
      value: '',
      ignore: true
    };
  }
}
