import ts from 'typescript';

import {
  Context,
  NodeParser,
  ObjectProperty,
  ObjectType,
  ReferenceType,
  SubNodeParser
} from 'ts-json-schema-generator';
import { getKey } from 'ts-json-schema-generator/dist/src//Utils/nodeKey';
import type { BaseType } from 'ts-json-schema-generator/dist/src/Type/BaseType';
import { NeverType } from 'ts-json-schema-generator/dist/src/Type/NeverType';
import { isNodeHidden } from 'ts-json-schema-generator/dist/src/Utils/isHidden';

export class TypeLiteralNodeParser implements SubNodeParser {
  public constructor(
    protected childNodeParser: NodeParser,
    protected readonly additionalProperties: boolean
  ) {}

  public supportsNode(node: ts.TypeLiteralNode): boolean {
    return node.kind === ts.SyntaxKind.TypeLiteral;
  }

  public createType(
    node: ts.TypeLiteralNode,
    context: Context,
    reference?: ReferenceType
  ): BaseType {
    const id = this.getTypeId(node, context);
    if (reference) {
      reference.setId(id);
      reference.setName(id);
    }

    const properties = this.getProperties(node, context);

    if (properties === undefined) {
      return new NeverType();
    }

    return new ObjectType(
      id,
      [],
      properties,
      this.getAdditionalProperties(node, context)
    );
  }

  protected getProperties(
    node: ts.TypeLiteralNode,
    context: Context
  ): ObjectProperty[] | undefined {
    let hasRequiredNever = false;

    const properties = node.members
      .filter(ts.isPropertySignature)
      .filter((propertyNode) => !isNodeHidden(propertyNode))
      .map((propertyNode) => {
        const propertySymbol: ts.Symbol = (propertyNode as any).symbol;
        const type = this.childNodeParser.createType(propertyNode.type!, context);
        const objectProperty = new ObjectProperty(
          //
          // ONLY CHANGE HERE
          //
          // The following avoids errors when propertySymbol is undefined
          propertySymbol?.getName() || (propertyNode.name as any).escapedText,

          type,
          !propertyNode.questionToken
        );

        return objectProperty;
      })
      .filter((prop) => {
        if (prop.isRequired() && prop.getType() instanceof NeverType) {
          hasRequiredNever = true;
        }
        return !(prop.getType() instanceof NeverType);
      });

    if (hasRequiredNever) {
      return undefined;
    }

    return properties;
  }

  protected getAdditionalProperties(
    node: ts.TypeLiteralNode,
    context: Context
  ): BaseType | boolean {
    const indexSignature = node.members.find(ts.isIndexSignatureDeclaration);
    if (!indexSignature) {
      return this.additionalProperties;
    }

    return (
      this.childNodeParser.createType(indexSignature.type!, context) ??
      this.additionalProperties
    );
  }

  protected getTypeId(node: ts.Node, context: Context): string {
    return `structure-${getKey(node, context)}`;
  }
}
