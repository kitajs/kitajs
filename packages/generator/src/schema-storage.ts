import {
  ArrayType,
  BaseType,
  Config,
  Context,
  createFormatter,
  createParser,
  Definition,
  DefinitionType,
  NodeParser,
  OptionalType,
  PrimitiveType,
  Schema,
  SchemaGenerator,
  ts,
  UndefinedType,
  UnionType
} from '@kitajs/ts-json-schema-generator';
import type { KitaAST } from './ast';
import { KitaError } from './errors';
import type { Route } from './route';
import { getReturnType } from './util/node';

export class SchemaStorage extends SchemaGenerator {
  public override readonly nodeParser!: NodeParser;
  protected readonly definitions: Record<string, Definition> = {};

  constructor(tsconfig: string, override readonly program: ts.Program) {
    const config: Config = { tsconfig, encodeRefs: false };
    super(program, createParser(program, config), createFormatter(config), config);
  }

  /**
   * Saves and returns a ts.Node respective json schema.
   */
  consumeNode(node: ts.Node): Schema {
    const type = this.nodeParser.createType(node, new Context(node));

    if (!type) {
      throw KitaError(`Could not create type for node \`${node.getText()}\``);
    }

    // Prevents from creating multiple `{ id: '...', type: 'string' }`-like definitions
    const native = this.asPrimitiveType(type);

    if (native) {
      return this.getDefinition(native);
    }

    // Includes this node into our recursive definition
    this.appendRootChildDefinitions(type, this.definitions);

    // Returns reference to this node
    return this.getDefinition(type);
  }

  /**
   * Saves and returns a function response type respective json schema.
   */
  consumeResponseType(node: ts.SignatureDeclaration, route: Route): Schema {
    const returnType = getReturnType(node, this.program.getTypeChecker());

    const type = this.nodeParser.createType(returnType, new Context(node));

    if (!type) {
      throw KitaError(`Could not create type for node \`${returnType.getText()}\``);
    }

    // Prevents from creating multiple `{ id: '...', type: 'string' }`-like definitions
    const native = this.asPrimitiveType(type);

    if (native) {
      return this.getDefinition(native);
    }

    //@ts-expect-error - Defines a return type name to avoid uri-reference problem
    type.name ??= `${route.schema.operationId}Response`;

    // Includes this node into our recursive definition
    this.appendRootChildDefinitions(type, this.definitions);

    // Returns reference to this node
    return this.getDefinition(type);
  }

  /**
   *  Tries to resolve the provided type into a primitive type, if it is one.
   */
  protected asPrimitiveType(type: BaseType): BaseType | undefined {
    if (type instanceof DefinitionType) {
      type = type.getType();
    }

    if (type instanceof PrimitiveType || type instanceof UndefinedType) {
      return type;
    }

    if (type instanceof OptionalType) {
      if (this.asPrimitiveType(type.getType())) {
        return type;
      }
    }

    if (type instanceof UnionType) {
      if (type.getTypes().every((t) => this.asPrimitiveType(t))) {
        return type;
      }
    }

    if (type instanceof ArrayType) {
      if (this.asPrimitiveType(type.getItem())) {
        return type;
      }
    }

    return undefined;
  }

  /**
   * Transforms a json schema {@link BaseType} into a reference json object (`{ $ref: '<name>' }`).
   */
  protected getDefinition(type: BaseType): Schema {
    const def = this.typeFormatter.getDefinition(type);

    // See https://github.com/vega/ts-json-schema-generator/pull/1386
    // This was included in the PR, but it was out of scope, so this
    // still needs to be done manually.
    if (def.$ref) {
      def.$ref = def.$ref.replace('#/definitions/', '');
    }

    return def;
  }

  /**
   * Apply all generated definitions to the provided AST.
   */
  applyDefinitions(ast: KitaAST) {
    for (const [key, def] of Object.entries(this.definitions)) {
      ast.schemas.push({ $id: key, ...def });
    }
  }
}
