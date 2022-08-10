import {
  Config,
  Context,
  createFormatter,
  createParser,
  Definition,
  Schema,
  SchemaGenerator,
  StringMap
} from 'ts-json-schema-generator';
import type ts from 'typescript';

export class SchemaStorage extends SchemaGenerator {
  readonly definitions: StringMap<Definition> = {};

  constructor(tsconfig: string, program: ts.Program) {
    const config: Config = { tsconfig, minify: true };

    const nodeParser = createParser(program, config);
    const typeFormatter = createFormatter(config);

    super(program, nodeParser, typeFormatter, config);
  }

  public consumeNode(node: ts.Node) {
    const type = this.nodeParser.createType(node, new Context(node));

    if (!type) {
      throw new Error(`Could not create type for node \`${node.getText()}\``);
    }

    // Includes this node into our recursive definition
    this.appendRootChildDefinitions(type, this.definitions);

    // Returns the reference type if it exists
    const definition = this.typeFormatter.getDefinition(type);

    // Removes the definitions prefix, as all schemas are registered as $id's.
    definition.$ref && (definition.$ref = definition.$ref.replace('#/definitions/', ''));

    return definition;
  }

  public getDefinitions(): Schema[] {
    return Object.entries(this.definitions).map(([key, def]) => ({ $id: key, ...def }));
  }
}
