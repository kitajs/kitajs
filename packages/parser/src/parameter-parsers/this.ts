import {
  InvalidParameterUsageError,
  Parameter,
  ParameterParser,
  Route,
  RouteMapperNotExportedError,
  RouteOptionsAlreadyDefinedError
} from '@kitajs/common';
import ts from 'typescript';
import {
  getParameterGenerics,
  getTypeName,
  getTypeNodeName,
  isExportedFunction,
  isExportedVariable,
  toPrettySource
} from '../util/nodes';
import { buildAccessProperty } from '../util/syntax';

export class ThisParameterParser implements ParameterParser {
  agnostic = true;

  supports(param: ts.ParameterDeclaration) {
    return getTypeNodeName(param) === 'Use' || getTypeName(param) === 'this';
  }

  parse(param: ts.ParameterDeclaration, route: Route, fn: ts.FunctionDeclaration, index: number): Parameter {
    const isThis = getTypeName(param) === 'this' && index === 0;
    const isUse = getTypeNodeName(param) === 'Use';

    // other parameter with Use type
    if (!isThis && isUse) {
      throw new InvalidParameterUsageError(
        'Use',
        'The `Use<>` parameter can only be bound to the `this` keyword.',
        toPrettySource(param)
      );
    }

    // this parameter with other type
    if (!isUse && isThis) {
      throw new InvalidParameterUsageError(
        'this',
        'The `this` parameter can only be used with the `Use<>` type.',
        toPrettySource(param)
      );
    }

    const [config] = getParameterGenerics(param);

    if (!config) {
      throw new InvalidParameterUsageError(
        'this',
        'The `this` parameter must be used with a configuration type.',
        toPrettySource(param)
      );
    }

    if (!ts.isTypeQueryNode(config) && !ts.isTupleTypeNode(config)) {
      throw new InvalidParameterUsageError(
        'this',
        'The `this` parameter must be used `typeof` reference or a literal tuple of `typeof` references',
        toPrettySource(param)
      );
    }

    if (route.options) {
      throw new RouteOptionsAlreadyDefinedError(route.controllerPrettyPath);
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
        throw new RouteMapperNotExportedError(type, toPrettySource(config));
      }

      route.options = `${route.controllerName}.${type}($1)`;

      return { value: '', ignore: true };
    }

    // Maps all typeof references
    for (const element of config.elements) {
      if (!ts.isTypeQueryNode(element)) {
        throw new InvalidParameterUsageError(
          'this',
          'The `this` parameter must only have `typeof` references inside its tuple.',
          toPrettySource(param)
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
        throw new RouteMapperNotExportedError(type, toPrettySource(config));
      }

      if (!route.options) {
        route.options = '$1';
      }

      route.options = `${buildAccessProperty(route.controllerName, type)}(${route.options})`;
    }

    // This parameter is synthetic, so this result will not be used.
    return { value: '', ignore: true };
  }
}
