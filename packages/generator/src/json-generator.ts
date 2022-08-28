import {
  Config,
  Context,
  createFormatter,
  createParser,
  Definition,
  SchemaGenerator,
  StringMap,
  ts,
  Schema
} from '@kitajs/ts-json-schema-generator';
import type { Route } from './generator-data';
import { getReturnType } from './util/type-resolver';

export class SchemaStorage extends SchemaGenerator {
  readonly definitions: StringMap<Definition> = {};

  constructor(tsconfig: string, override readonly program: ts.Program) {
    const config: Config = {
      tsconfig,
      minify: true,
      useDefinitions: false,
      encodeRefs: false
    };

    const nodeParser = createParser(program, config);

    const typeFormatter = createFormatter(config);

    super(program, nodeParser, typeFormatter, config);
  }

  public consumeNode(node: ts.Node): Schema {
    const type = this.nodeParser.createType(node, new Context(node));

    if (!type) {
      throw new Error(`Could not create type for node \`${node.getText()}\``);
    }

    // Includes this node into our recursive definition
    this.appendRootChildDefinitions(type, this.definitions);

    // Returns reference to this node
    return this.typeFormatter.getDefinition(type);
  }

  public consumeResponseType(node: ts.SignatureDeclaration, route: Route): Schema {
    const returnType = getReturnType(node, this.program.getTypeChecker());

    const type = this.nodeParser.createType(returnType, new Context(node));

    if (!type) {
      throw new Error(`Could not create type for node \`${returnType.getText()}\``);
    }

    //@ts-expect-error - Defines a return type name to avoid uri-reference problems
    type.name ??= `${route.controllerName}_${route.method}_Response`;

    // Includes this node into our recursive definition
    this.appendRootChildDefinitions(type, this.definitions);

    // Returns reference to this node
    return this.typeFormatter.getDefinition(type);
  }

  public getDefinitions(): Schema[] {
    return Object.entries(this.definitions).map(([key, def]) => ({ $id: key, ...def }));
  }
}
