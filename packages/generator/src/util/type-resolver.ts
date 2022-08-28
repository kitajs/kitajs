import ts from 'typescript';

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
    ts.NodeBuilderFlags.NoTruncation
  ) as ts.TypeNode;
}
