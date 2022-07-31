import type { Config, NodeParser, Schema, TypeFormatter } from 'ts-json-schema-generator';
import { createFormatter, createParser, SchemaGenerator } from 'ts-json-schema-generator';
import type ts from 'typescript';

export class JsonGenerator {
  private config: Config;
  private typeFormatter!: TypeFormatter;
  private nodeParser!: NodeParser;

  // TODO: Make private
  public generator: SchemaGenerator;

  constructor(tsconfig: string, program: ts.Program) {
    this.config = {
      tsconfig,
      minify: true,
      // TODO: ver se isso faz sentido
      encodeRefs: false
    };

    this.nodeParser = createParser(program, this.config);
    this.typeFormatter = createFormatter(this.config);
    this.generator = new SchemaGenerator(
      program,
      this.nodeParser,
      this.typeFormatter,
      this.config
    );
  }

  public schema: Schema = {};

  // TODO: https://github.com/vega/ts-json-schema-generator/issues/1338
  async generateRef(_node: ts.Node) {
    return { 
      // $ref: '#/definitions//TODO'
     };
  }
}
