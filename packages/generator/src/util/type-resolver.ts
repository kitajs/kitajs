import ts from 'typescript';

export function returnType(node: ts.MethodDeclaration, typeChecker: ts.TypeChecker) {
  const signature = typeChecker.getSignatureFromDeclaration(node);
  const implicitType = typeChecker.getReturnTypeOfSignature(signature!);

  return typeChecker.typeToTypeNode(
    implicitType,
    undefined,
    ts.NodeBuilderFlags.NoTruncation
  ) as ts.TypeNode;
}
