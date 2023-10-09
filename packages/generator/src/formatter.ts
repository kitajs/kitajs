import { KitaConfig, Route, SourceFormatter } from '@kitajs/common';
import { Definition } from 'ts-json-schema-generator';
import ts from 'typescript';
import { index } from './templates';
import { plugin } from './templates/plugin';
import { route } from './templates/route';
import { schemas } from './templates/schema';
import { KitaWriter } from './writer';

export class KitaFormatter implements SourceFormatter {
  readonly writer: KitaWriter;

  constructor(
    readonly config: KitaConfig,
    readonly compilerOptions: ts.CompilerOptions
  ) {
    this.writer = new KitaWriter(compilerOptions, this.config);
  }

  generateRoute(r: Route) {
    const filename = `routes/${r.schema.operationId}.ts`;
    this.writer.write(filename, route(r, this.config.cwd));
  }

  generate(routes: Route[], definitions: Definition[]) {
    this.writer.write('index.ts', index(routes));
    this.writer.write('schemas.ts', schemas(definitions));
    this.writer.write('plugin.ts', plugin(routes));
  }

  flush() {
    this.writer.flush();
  }
}
