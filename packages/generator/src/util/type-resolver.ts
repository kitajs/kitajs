import ts from 'typescript';

import path from 'node:path';
/**
 * The below code is a workaround to generate a return type with a valid source file.
 *
 * @param controllerName - Used to generate different hashes for each type
 */
export function getReturnType(
  node: ts.SignatureDeclaration,
  typeChecker: ts.TypeChecker,
  routeId: string
) {
  if (node.type) {
    return node.type;
  }

  const signature = typeChecker.getSignatureFromDeclaration(node);
  const implicitType = typeChecker.getReturnTypeOfSignature(signature!);

  // Source code above to get all imports needed for type resolution
  const type = `${node.getSourceFile().getFullText()};
export type Result${routeId} =${typeChecker.typeToString(implicitType)};`;

  const fakeSource = ts.createSourceFile(
    // See https://github.com/vega/ts-json-schema-generator/blob/be35510af8b7e5874b8fdf2e6eff712e179ec6ad/src/Utils/nodeKey.ts#L38
    path.resolve(process.cwd(), routeId),
    type,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  //@ts-expect-error - the .type of the above node is the provided node return type.
  return fakeSource.statements[fakeSource.statements.length - 1]!.type;
}
