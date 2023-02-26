import {
  BaseType,
  Context,
  createFormatter,
  createParser,
  Definition,
  Schema,
  SchemaGenerator,
  ts
} from 'ts-json-schema-generator';
import type { KitaConfig } from './config';
import { KitaError } from './errors';
import type { Route } from './route';
import { getReturnType } from './util/node';
import { asPrimitiveType } from './util/type';

export class SchemaStorage extends SchemaGenerator {
  protected readonly definitions: Record<string, Definition> = {};

  constructor(private kitaConfig: KitaConfig, override readonly program: ts.Program) {
    const config = {
      tsconfig: kitaConfig.tsconfig,
      ...kitaConfig.schema.generator,
      parsers: undefined,
      formatters: undefined
    };

    super(
      program,

      createParser(program, config, (mut) => {
        for (const parser of kitaConfig.schema.generator.parsers) {
          mut.addNodeParser(parser);
        }
      }),

      createFormatter(config, (mut) => {
        for (const formatter of kitaConfig.schema.generator.formatters) {
          mut.addTypeFormatter(formatter);
        }
      }),

      config
    );

    {
      // This is a workaround to move the response definition field to the end of the object
      // It's necessary for when the response references another definition that was not yet defined
      // throwing a reference error because the referenced definition was going to be defined after
      // the response definition
      const getChildren = this.typeFormatter.getChildren.bind(this.typeFormatter);

      this.typeFormatter.getChildren = (type) => {
        const children = getChildren(type);

        // the type is always the first child
        const first = children.shift();
        first && children.push(first);

        return children;
      };
    }

    // Get definition for a base type without the `#/definitions/` prefix.
    //
    // This was a proposed option in ts-json-schema-generator, buy ruled out as out of scope.
    // See https://github.com/vega/ts-json-schema-generator/pull/1386
    {
      const getDefinition = this.typeFormatter.getDefinition.bind(this.typeFormatter);
      this.typeFormatter.getDefinition = (type) => {
        const def = getDefinition(type);

        if (def.$ref) {
          def.$ref = def.$ref.replace(/^\#\/definitions\//g, '');
        }

        return def;
      };
    }
  }

  createType(node: ts.Node, stack: string[]) {
    try {
      return this.nodeParser.createType(node, new Context(node));
    } catch (error) {
      throw KitaError(
        `Could not create type for node \`${
          node.getSourceFile() ? node.getText() : '<unknown>'
        }\``,
        stack,
        { error, node }
      );
    }
  }

  /**
   * Saves and returns a {@link ts.Node}'s respective json schema.
   */
  consumeNode(node: ts.Node, stack: string[]): Schema {
    const type = this.createType(node, stack);

    if (!type) {
      throw KitaError(`Could not create type for node \`${node.getText()}\``);
    }

    {
      // Prevents from creating multiple `{ id: '...', type: 'string' }`-like definitions
      const native = asPrimitiveType(type);

      if (native) {
        return this.getDefinition(native);
      }
    }

    // Includes this node into our recursive definition
    this.appendRootChildDefinitions(type, this.definitions);

    // Returns reference to this node
    return this.getDefinition(type);
  }

  /**
   * Saves and returns a function's response type respective json schema.
   */
  consumeResponseType(node: ts.SignatureDeclaration, operationId: string): Schema {
    const returnType = getReturnType(node, this.program.getTypeChecker());

    const type = this.createType(returnType, [route.controllerPath]);

    if (!type) {
      throw KitaError(`Could not create type for node \`${returnType.getText()}\``);
    }

    {
      // Prevents from creating multiple `{ id: '...', type: 'string' }`-like definitions
      const native = asPrimitiveType(type);

      if (native) {
        return this.getDefinition(native);
      }
    }

    //@ts-expect-error - Defines a return type name to avoid uri-reference problem
    type.name ??= `${operationId}Response`;

    // Includes this node into our recursive definition
    this.appendRootChildDefinitions(type, this.definitions);

    // Returns reference to this node
    return this.getDefinition(type);
  }

  /**
   * Get definition for a base type without the `#/definitions/` prefix.
   */
  getDefinition(type: BaseType): Definition {
    return this.typeFormatter.getDefinition(type);
  }

  /**
   * Tries to parse the provided type into his absolute primitive version
   */
  asPrimitive(type: ts.Node, stack: string[]) {
    return asPrimitiveType(this.createType(type, stack));
  }

  getDefinitions(): Definition[] {
    return Object.entries(this.definitions).map(([key, def]) => ({
      // Encode the definition key if the option is enabled
      $id: this.kitaConfig.schema.generator.encodeRefs ? encodeURIComponent(key) : key,
      ...def
    }));
  }
}
