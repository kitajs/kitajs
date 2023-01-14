import {
  BaseType,
  Config,
  Context,
  Definition,
  NodeParser,
  Schema,
  SchemaGenerator,
  TypeFormatter,
  createFormatter,
  createParser,
  ts
} from 'ts-json-schema-generator';
import type { KitaAST } from './ast';
import { KitaError } from './errors';
import type { Route } from './route';
import { getReturnType } from './util/node';
import { asPrimitiveType } from './util/type';

export class SchemaStorage extends SchemaGenerator {
  public override readonly nodeParser!: NodeParser;
  public override readonly typeFormatter!: TypeFormatter;
  protected readonly definitions: Record<string, Definition> = {};

  constructor(tsconfig: string, override readonly program: ts.Program) {
    const config: Config = {
      tsconfig,
      encodeRefs: true,
      sortProps: true,
      strictTuples: true,
      jsDoc: 'extended'
    };

    super(program, createParser(program, config), createFormatter(config), config);

    // This is a workaround to move the response definition field to the end of the object
    // It's necessary for when the response references another definition that was not yet defined
    // throwing a reference error because the referenced definition was going to be defined after
    // the response definition
    const getChildren = this.typeFormatter.getChildren;
    this.typeFormatter.getChildren = (type: BaseType) => {
      const children = getChildren.call(this.typeFormatter, type);

      // the type is always the first child
      const first = children.shift();
      first && children.push(first);

      return children;
    };

    // This was included in the PR, but it was out of scope, so this
    // still needs to be done manually.
    // See https://github.com/vega/ts-json-schema-generator/pull/1386
    const getDefinition = this.typeFormatter.getDefinition;
    this.typeFormatter.getDefinition = (type: BaseType) => {
      const def = getDefinition.call(this.typeFormatter, type);

      if (def.$ref) {
        def.$ref = def.$ref.replace('#/definitions/', '');
      }

      return def;
    };
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
    const native = asPrimitiveType(type);

    if (native) {
      return this.typeFormatter.getDefinition(native);
    }

    // Includes this node into our recursive definition
    this.appendRootChildDefinitions(type, this.definitions);

    // Returns reference to this node
    return this.typeFormatter.getDefinition(type);
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
    const native = asPrimitiveType(type);

    if (native) {
      return this.typeFormatter.getDefinition(native);
    }

    //@ts-expect-error - Defines a return type name to avoid uri-reference problem
    type.name ??= `${route.schema.operationId}Response`;

    // Includes this node into our recursive definition
    this.appendRootChildDefinitions(type, this.definitions);

    // Returns reference to this node
    return this.typeFormatter.getDefinition(type);
  }

  /**
   * Apply all generated definitions to the provided AST.
   */
  applyDefinitions(ast: KitaAST) {
    for (const [key, def] of Object.entries(this.definitions)) {
      ast.schemas.push({ $id: encodeURI(key), ...def });
    }
  }
}
