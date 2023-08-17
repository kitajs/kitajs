import ts from 'typescript';
import { CannotResolveParameterError } from '../errors';
import { unquote } from './syntax';

/**
 *  Gets the trimmed type name.
 */
export function getTypeName(type?: ts.TypeNode) {
  return type?.getFirstToken()?.getText().trim();
}

/**
 *  Gets the parameter type name.
 */
export function getParameterTypeName(param: ts.ParameterDeclaration) {
  return getTypeName(param.type);
}

/**
 * Resolves the parameter name to be used in route schemas and query pickers.
 *
 * @param genericIndex If the provided parameter is a NodeWithTypeArguments, which generic we should use?
 */
export function getParameterName(node: ts.ParameterDeclaration, genericIndex: number) {
  const genericNode = getParameterGenerics(node)[genericIndex];

  // The user overridden the name of the parameter with a string literal
  if (genericNode) {
    // @ts-expect-error TODO: Find correct type
    if (genericNode.name && !ts.isIdentifier(genericNode.name)) {
      throw new CannotResolveParameterError(toPrettySource(node));
    }

    return unquote(genericNode.getText());
  }

  // We may find a parameter with a destructuring pattern or similar syntaxes
  if (!ts.isIdentifier(node.name)) {
    throw new CannotResolveParameterError(toPrettySource(node));
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
    // There's no documentation on what flags we should use
    // I talked with one of typescript engineers on discord and
    // probably only NoTruncation would be useful. However, more
    // research can be done.
    ts.NodeBuilderFlags.NoTruncation
  )!;
}

/**
 * Returns true if the provided node is a default export function.
 */
export function isDefaultExportFunction(node: ts.Node): node is ts.FunctionDeclaration {
  return (
    // Is a function type
    ts.isFunctionDeclaration(node) &&
    // needs to have modifiers
    !!node.modifiers &&
    // first modifier needs to be `export`
    node.modifiers[0]!.kind === ts.SyntaxKind.ExportKeyword &&
    // second modifier needs to be `default`
    node.modifiers[1]!.kind === ts.SyntaxKind.DefaultKeyword
  );
}

/**
 * If the provided type is a promise, returns the type of the promise, otherwise returns the type itself.
 */
export function unwrapPromiseType(type: ts.TypeNode) {
  if (ts.isTypeReferenceNode(type) && type.typeName.getText() === 'Promise') {
    return type.typeArguments?.[0] || type;
  }

  return type;
}

export function toPrettySource(node: ts.Node) {
  const source = node.getSourceFile();
  const pos = source.getLineAndCharacterOfPosition(node.getStart());
  return `${source.fileName}:${pos.line + 1}:${pos.character + 1}`;
}
