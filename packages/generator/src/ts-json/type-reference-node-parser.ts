import ts from 'typescript';

import { Context, NodeParser } from 'ts-json-schema-generator/dist/src/NodeParser';
import type { SubNodeParser } from 'ts-json-schema-generator/dist/src/SubNodeParser';
import { AnnotatedType } from 'ts-json-schema-generator/dist/src/Type/AnnotatedType';
import { ArrayType } from 'ts-json-schema-generator/dist/src/Type/ArrayType';
import type { BaseType } from 'ts-json-schema-generator/dist/src/Type/BaseType';
import { StringType } from 'ts-json-schema-generator/dist/src/Type/StringType';

const invlidTypes: { [index: number]: boolean } = {
  [ts.SyntaxKind.ModuleDeclaration]: true,
  [ts.SyntaxKind.VariableDeclaration]: true
};

export class TypeReferenceNodeParser implements SubNodeParser {
  public constructor(
    private typeChecker: ts.TypeChecker,
    private childNodeParser: NodeParser
  ) {}

  public supportsNode(node: ts.TypeReferenceNode): boolean {
    return node.kind === ts.SyntaxKind.TypeReference;
  }

  public createType(node: ts.TypeReferenceNode, context: Context): BaseType | undefined {
    let typeSymbol = this.typeChecker.getSymbolAtLocation(node.typeName)!;

    if (typeSymbol.flags & ts.SymbolFlags.Alias) {
      const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);

      return this.childNodeParser.createType(
        aliasedSymbol.declarations!.filter(
          (n: ts.Declaration) => !invlidTypes[n.kind]
        )[0]!,

        this.createSubContext(node, context)
      );
    }

    if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
      return context.getArgument(typeSymbol.name);
    }
    if (typeSymbol.name === 'Array' || typeSymbol.name === 'ReadonlyArray') {
      const type = this.createSubContext(node, context).getArguments()[0];
      if (type === undefined) {
        return undefined;
      }
      return new ArrayType(type);
    }

    if (typeSymbol.name === 'Date') {
      return new AnnotatedType(new StringType(), { format: 'date-time' }, false);
    }

    if (typeSymbol.name === 'RegExp') {
      return new AnnotatedType(new StringType(), { format: 'regex' }, false);
    }

    // CHANGED HERE
    //
    // Handle promise type
    if (typeSymbol.name === 'Promise') {
      return this.childNodeParser.createType(
        node.typeArguments![0]!,
        this.createSubContext(node, context)
      );
    }

    return this.childNodeParser.createType(
      typeSymbol.declarations!.filter((n: ts.Declaration) => !invlidTypes[n.kind])[0]!,
      this.createSubContext(node, context)
    );
  }

  private createSubContext(node: ts.TypeReferenceNode, parentContext: Context): Context {
    const subContext = new Context(node);
    if (node.typeArguments && node.typeArguments.length) {
      for (const typeArg of node.typeArguments) {
        const type = this.childNodeParser.createType(typeArg, parentContext);
        subContext.pushArgument(type);
      }
    }
    return subContext;
  }
}
