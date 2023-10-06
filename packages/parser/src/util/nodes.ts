import { CannotResolveParameterNameError } from '@kitajs/common';
import path from 'node:path';
import ts, { ModifierLike, NodeArray } from 'typescript';
import { unquote } from './syntax';

/** Gets the trimmed type name. */
export function getTypeName(type?: ts.Node) {
  return type?.getFirstToken()?.getText().trim();
}

/** Gets the parameter type name. */
export function getTypeNodeName(param: Pick<ts.ParameterDeclaration, 'type'>) {
  return getTypeName(param.type);
}

/** Gets the parameter type name. */
export function getIdentifierName(param: ts.BindingName) {
  return ts.isIdentifier(param) ? param.text.trim() : param.getText().trim();
}

/**
 * Tries to resolve the parameter name, either by a string literal specified by {@linkcode genericIndex} or the parameter
 * name.
 *
 * @param genericIndex If the provided parameter is a NodeWithTypeArguments, which generic we should use?
 */
export function getParameterName(node: ts.ParameterDeclaration, genericIndex: number) {
  const genericNode = getParameterGenerics(node)[genericIndex];

  // The user overridden the name of the parameter with a string literal
  if (genericNode) {
    // @ts-expect-error TODO: Find correct type
    if (genericNode.name && !ts.isIdentifier(genericNode.name)) {
      throw new CannotResolveParameterNameError(genericNode);
    }

    return unquote(genericNode.getText());
  }

  // We may find a parameter with a destructuring pattern or similar syntaxes
  if (!ts.isIdentifier(node.name)) {
    throw new CannotResolveParameterNameError(node.name);
  }

  // The user didn't override the name of the parameter, so we use the parameter name
  return getIdentifierName(node.name);
}

/** Gets the parameter type generics. */
export function getParameterGenerics(param: ts.ParameterDeclaration) {
  return (param.type as ts.NodeWithTypeArguments)?.typeArguments || [];
}

/** If the provided function has a `this` parameter. */
export function hasThisParameter(fn: ts.FunctionDeclaration) {
  return fn.parameters[0] && getIdentifierName(fn.parameters[0].name) === 'this';
}

/** Returns true if the parameter is optional or has a initializer. */
export function isParamOptional(param: ts.ParameterDeclaration) {
  return !!param.questionToken || !!param.initializer;
}

/** Finds the return type of a declaration or creates one if it doesn't exist. */
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
    // research should be done.
    ts.NodeBuilderFlags.NoTruncation
  )!;
}

/** Returns true if the provided node is a exported function. */
export function isExportedFunction(
  node: ts.Node
): node is ts.FunctionDeclaration & { modifiers: NodeArray<ModifierLike> } {
  return (
    // Is a function type
    ts.isFunctionDeclaration(node) &&
    // needs to have modifiers
    !!node.modifiers &&
    // `export` modifier needs to be present
    node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
  );
}

export function isExportedVariable(
  node: ts.Node
): node is ts.VariableStatement & { modifiers: NodeArray<ModifierLike> } {
  return (
    // Is a function type
    ts.isVariableStatement(node) &&
    // needs to have modifiers
    !!node.modifiers &&
    // `export` modifier needs to be present
    node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
  );
}

/** Returns true if the provided node is a default exported function. */
export function isDefaultExportFunction(
  node: ts.Node
): node is ts.FunctionDeclaration & { modifiers: NodeArray<ModifierLike> } {
  return (
    isExportedFunction(node) &&
    // `default` modifier needs to be present
    node.modifiers.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)
  );
}

/** Returns true if the provided node is a default exported function. */
export function hasName(node: { name?: ts.Identifier }, name: string): boolean {
  return !!node.name && getIdentifierName(node.name) === name;
}

/** If the provided type is a promise, returns the type of the promise, otherwise returns the type itself. */
export function unwrapPromiseType(type: ts.TypeNode) {
  if (ts.isTypeReferenceNode(type) && type.typeName.getText() === 'Promise') {
    return type.typeArguments?.[0] || type;
  }

  return type;
}

/**
 * Returns a pretty path for the provided node.
 *
 * @example `src/controllers/users.ts:12:3`
 */
export function toPrettySource(node: ts.Node) {
  const source = node.getSourceFile();
  const pos = source.getLineAndCharacterOfPosition(node.getStart());
  return path.relative(process.cwd(), `${source.fileName}:${pos.line + 1}:${pos.character + 1}`);
}
