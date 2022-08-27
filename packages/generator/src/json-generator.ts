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
import type { Route } from './generator-data';
import { buildFormatterAugmentor, buildParserAugmentor } from './ts-json/argumentors';
import { getReturnType } from './util/type-resolver';

export class SchemaStorage extends SchemaGenerator {
  readonly definitions: StringMap<Definition> = {};

  constructor(tsconfig: string, override readonly program: ts.Program) {
    const config: Config = { tsconfig, minify: true };

    const nodeParser = createParser(
      program,
      config,
      buildParserAugmentor(program.getTypeChecker())
    );

    const typeFormatter = createFormatter(config, buildFormatterAugmentor());

    super(program, nodeParser, typeFormatter, config);
  }

  public consumeNode(node: ts.Node) {
    const type = this.nodeParser.createType(node, new Context(node));

    if (!type) {
      throw new Error(`Could not create type for node \`${node.getText()}\``);
    }

    // Includes this node into our recursive definition
    this.appendRootChildDefinitions(type, this.definitions);

    // Returns reference to this node
    return this.typeFormatter.getDefinition(type);
  }

  public consumeResponseType(node: ts.SignatureDeclaration, route: Route) {
    const id = route.operationId || route.controllerName + route.method;

    const returnType = getReturnType(node, this.program.getTypeChecker(), id);

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
