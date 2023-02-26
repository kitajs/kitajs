import ts from 'typescript';
import { CannotResolveParameterError } from '../errors';
import { unquote } from './syntax';

/**
 *  Gets the parameter type name.
 */
export function getParameterTypeName(param: ts.ParameterDeclaration) {
  return param.type?.getFirstToken()?.getText();
}

/**
 * Resolves the parameter name to be used in route schemas and query pickers.
 *
 * @param genericIndex If the provided parameter is a NodeWithTypeArguments, which generic we should use?
 */
export function getParameterName(node: ts.ParameterDeclaration, genericIndex: number) {
  const genericNode = (node.type as ts.NodeWithTypeArguments)?.typeArguments?.[
    genericIndex
  ];

  // The user overridden the name of the parameter with a string literal
  if (genericNode) {
    return unquote(genericNode.getText());
  }

  // We may find a parameter with a destructuring pattern or similar syntaxes
  if (!ts.isIdentifier(node.name)) {
    throw new CannotResolveParameterError(node);
  }

  // The user didn't override the name of the parameter, so we use the parameter name
  return node.name.text.trim();
}

/**
 *  Gets the parameter type generics.
 */
export function getParameterGenerics(param: ts.ParameterDeclaration) {
  return (param.type as ts.NodeWithTypeArguments)?.typeArguments;
}

/**
 * Gets the parameter name in a safe string, if the parameter is a destructuring pattern
 * it will return `param${index}`.
 */
export function getParamSafeName(param: ts.ParameterDeclaration, index: number) {
  // We may find a parameter with a destructuring pattern or similar syntaxes
  return param.name.kind === ts.SyntaxKind.Identifier
    ? param.name.getText().trim()
    : `param${index}`;
}

/**
 * If the provided function has a `this` parameter.
 */
export function hasThisParameter(fn: ts.FunctionDeclaration) {
  return fn.parameters[0]?.name.getText() === 'this';
}

export function isParamOptional(param: ts.ParameterDeclaration) {
  return !!param.questionToken || !!param.initializer;
}
