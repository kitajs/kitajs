import { CannotCreateNodeTypeError, kSchemaDefinitions, type Provider, type ProviderParser } from '@kitajs/common';
import path from 'node:path';
import type { ts } from 'ts-json-schema-generator';

import type { SchemaBuilder } from '../schema/builder';

export class SchemasProviderParser implements ProviderParser {
  constructor(
    private checker: ts.TypeChecker,
    private schemaBuilder: SchemaBuilder
  ) {}

  supports(file: ts.SourceFile): boolean {
    // TODO: Ensure file is in root directory
    return path.basename(file.fileName) === 'schemas.ts';
  }

  parse(source: ts.SourceFile): Provider | undefined {
    const symbol = this.checker.getSymbolAtLocation(source);

    if (!symbol) {
      throw new CannotCreateNodeTypeError(source, 'Could not find symbol for source file');
    }

    const exports = this.checker.getExportsOfModule(symbol);

    for (const exportedNode of exports) {
      const originalNode = exportedNode.declarations?.[0] || exportedNode.valueDeclaration!;
      const type = this.checker.getTypeAtLocation(originalNode);
      const typeNode = this.checker.typeToTypeNode(type, undefined, undefined);

      if (!typeNode) {
        throw new CannotCreateNodeTypeError(source, 'Could not find node for exported symbol');
      }

      const schema = this.schemaBuilder.createTypeSchema(typeNode);

      if (
        schema &&
        //@ts-expect-error - always define a name
        !schema.name
      ) {
        // @ts-expect-error - tries to find name
        schema.name = (originalNode?.name as ts.Identifier)?.getText();
      }

      try {
        // Applies to a custom definition
        this.schemaBuilder.appendChildDefinitions(schema, kSchemaDefinitions);
      } catch (error) {
        throw new CannotCreateNodeTypeError(originalNode, error);
      }
    }

    return undefined;
  }
}
