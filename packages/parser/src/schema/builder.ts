import type { KitaConfig } from '@kitajs/common';
import { CannotCreateNodeTypeError, MultipleDefinitionsError } from '@kitajs/common';
import {
  AliasType,
  AnnotatedType,
  ArrayType,
  BaseType,
  Context,
  Definition,
  DefinitionType,
  EnumType,
  IntersectionType,
  LiteralType,
  NodeParser,
  OptionalType,
  PrimitiveType,
  ReferenceType,
  Schema,
  TupleType,
  TypeFormatter,
  UndefinedType,
  UnionType,
  VoidType,
  createFormatter,
  createParser
} from 'ts-json-schema-generator';
import type ts from 'typescript';
import { toPrettySource } from '../util/nodes';
import { correctFormatterChildrenOrder, removeFormatterDefinitions } from './helpers';

export class SchemaBuilder {
  /** All definitions read from this schema builder */
  private definitions: Record<string, Definition> = {};

  private parser: NodeParser;
  private formatter: TypeFormatter;

  constructor(readonly config: KitaConfig, readonly program: ts.Program) {
    const generatorCfg = { ...config.schema.generator, tsconfig: config.tsconfig };

    this.parser = createParser(program, generatorCfg, (mut) => {
      for (const parser of config.schema.generator.parsers) {
        mut.addNodeParser(parser);
      }
    });

    this.formatter = removeFormatterDefinitions(
      correctFormatterChildrenOrder(
        createFormatter(generatorCfg, (mut) => {
          for (const formatter of config.schema.generator.formatters) {
            mut.addTypeFormatter(formatter);
          }
        })
      )
    );
  }

  /**
   * Creates a schema for the given ts node
   */
  createTypeSchema(node: ts.Node) {
    try {
      return this.parser.createType(node, new Context(node));
    } catch (error) {
      throw new CannotCreateNodeTypeError(toPrettySource(node));
    }
  }

  /**
   * Saves and returns a {@link ts.Node}'s respective json schema.
   */
  consumeNodeSchema(node: ts.Node, overrideName?: string): Schema {
    const type = this.createTypeSchema(node);

    {
      // Prevents from creating multiple `{ id: '...', type: 'string' }`-like definitions
      const primitive = this.toPrimitive(type);

      if (primitive) {
        return this.getDefinition(primitive);
      }
    }

    //@ts-expect-error - Defines a return type name to avoid uri-reference problem
    if (overrideName && !type.name) type.name ??= overrideName;

    // Includes this node into our recursive definition
    this.appendChildDefinitions(type);

    // Returns reference to this node
    return this.getDefinition(type);
  }

  /**
   * Attempts to unwrap possible type wrappers and resolve into a primitive typescript base type.
   */
  toPrimitive(type: ts.Node | BaseType): BaseType | undefined {
    type = type instanceof BaseType ? type : this.createTypeSchema(type);

    // Primitive types
    if (
      type instanceof PrimitiveType ||
      type instanceof UndefinedType ||
      type instanceof VoidType ||
      type instanceof LiteralType
    ) {
      return type;
    }

    // Type wrappers
    if (type instanceof DefinitionType || type instanceof ReferenceType || type instanceof AliasType) {
      return this.toPrimitive(type.getType());
    }

    // Wrappers that should return itself
    if (type instanceof OptionalType || type instanceof AnnotatedType) {
      if (this.toPrimitive(type.getType())) {
        return type;
      }
    }

    // Array type can have only one type
    if (type instanceof ArrayType) {
      if (this.toPrimitive(type.getItem())) {
        return type;
      }
    }

    // Array types that can have multiple types
    if (
      type instanceof UnionType ||
      type instanceof IntersectionType ||
      type instanceof EnumType ||
      type instanceof TupleType
    ) {
      if (type.getTypes().every((t) => this.toPrimitive(t))) {
        return type;
      }
    }

    // No primitive type found
    return undefined;
  }

  /**
   * Get definition for a base type without the `#/definitions/` prefix.
   */
  getDefinition(type: BaseType): Schema {
    return this.formatter.getDefinition(type);
  }

  /**
   * Get all definitions as an array.
   */
  toSchemaArray(): Definition[] {
    return Object.entries(this.definitions).map(([key, def]) => ({
      // Encode the definition key if the option is enabled
      $id: this.config.schema.generator.encodeRefs ? encodeURIComponent(key) : key,
      ...def
    }));
  }

  /**
   * Appends new definitions to the schema builder.
   */
  private appendChildDefinitions(type: BaseType) {
    const seen = new Set();
    const nameIdMap = new Map<string, string>();

    for (const child of this.formatter.getChildren(type)) {
      if (!(child instanceof DefinitionType) || seen.has(child.getId())) {
        continue;
      }

      // No duplicate definitions found
      seen.add(child.getId());

      const name = child.getName();
      const previousId = nameIdMap.get(name);

      // Remove def prefix from ids to avoid false alarms
      const childId = child.getId().replace(/def-/g, '');

      if (previousId && childId !== previousId) {
        throw new MultipleDefinitionsError(name);
      }

      // No duplicate definitions found
      nameIdMap.set(name, childId);

      // Add child definition
      if (!(name in this.definitions)) {
        this.definitions[name] = this.formatter.getDefinition(child.getType());
      }
    }
  }
}
