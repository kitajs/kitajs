import { ts } from 'ts-json-schema-generator';

export function getNodeSource(node: ts.Node, source: ts.SourceFile) {
  const { character, line } = source.getLineAndCharacterOfPosition(
    (node as ts.FunctionDeclaration).name?.pos ?? node.pos
  );
  return `${source.fileName}:${line + 1}:${character}`;
}

/**
 * True if this is visible outside this file, false otherwise.
 *
 * @link https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
 */
export function isNodeExported(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node) || !node.modifiers) {
    return false;
  }

  for (const modifier of node.modifiers) {
    if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
      return true;
    }
  }

  return false;
}

/**
 * Returns true if the provided node is `interface A {}` or `type A = {}`.
 */
export function isTypeOnlyNode(node: ts.Node) {
  return (
    node.kind === ts.SyntaxKind.TypeAliasDeclaration ||
    node.kind === ts.SyntaxKind.InterfaceDeclaration
  );
}

/**
 * The below code is a workaround to generate a return type with a valid source file.
 *
 * @param controllerName - Used to generate different hashes for each type
 */
export function getReturnType(
  node: ts.SignatureDeclaration,
  typeChecker: ts.TypeChecker
) {
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
  ) as ts.TypeNode;
}
