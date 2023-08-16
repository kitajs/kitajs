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
  const genericNode = (node.type as ts.NodeWithTypeArguments)?.typeArguments?.[genericIndex];

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
  return (param.type as ts.NodeWithTypeArguments)?.typeArguments || [];
}

/**
 * If the provided function has a `this` parameter.
 */
export function hasThisParameter(fn: ts.FunctionDeclaration) {
  return fn.parameters[0]?.name.getText() === 'this';
}

/**
 * Returns true if the parameter is optional or has a initializer.
 */
export function isParamOptional(param: ts.ParameterDeclaration) {
  return !!param.questionToken || !!param.initializer;
}

/**
 * Finds the return type of a declaration or creates one if it doesn't exist.
 */
export function getReturnType(node: ts.SignatureDeclaration, typeChecker: ts.TypeChecker) {
  if (node.type) {
    return node.type;
  }

  const signature = typeChecker.getSignatureFromDeclaration(node);
  const implicitType = typeChecker.getReturnTypeOfSignature(signature!);

  return typeChecker.typeToTypeNode(
    implicitType,
    undefined,
    // TODO: Find documentation for what flags we should have been using
    ts.NodeBuilderFlags.NoTruncation
  )!;
}

/**
 * Returns true if the provided node is a default export function.
 */
export function isDefaultExportFunction(node: ts.Node): node is ts.FunctionDeclaration {
  return ts.isExportAssignment(node) && !!node.modifiers?.some(ts.isDefaultClause) && ts.isFunctionDeclaration(node);
}
