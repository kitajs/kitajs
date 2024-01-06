import { CannotCreateNodeTypeError, Provider, ProviderParser, kSchemaDefinitions } from '@kitajs/common';
import path from 'path';
import { ts } from 'ts-json-schema-generator';
import type { Promisable } from 'type-fest';
import { SchemaBuilder } from '../schema/builder';

export class SchemasProviderParser implements ProviderParser {
  constructor(
    private checker: ts.TypeChecker,
    private schemaBuilder: SchemaBuilder
  ) {}

  /** Default provider handles all files. */
  supports(file: ts.SourceFile): Promisable<boolean> {
    return path.basename(file.fileName) === 'schemas.ts';
  }

  async parse(source: ts.SourceFile): Promise<Provider | undefined> {
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
        //@ts-expect-error - always define a
        !schema.name
      ) {
        // @ts-expect-error - try to find a name
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
