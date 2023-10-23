import { JsonSchema, KitaConfig, Route, SourceFormatter } from '@kitajs/common';
import ts from 'typescript';
import { index } from './templates';
import { plugin } from './templates/plugin';
import { route } from './templates/route';
import { KitaWriter } from './writer';

export class KitaFormatter implements SourceFormatter {
  readonly writer: KitaWriter;

  public onWrite?: (filename: string) => void;

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

  generate(routes: Route[], definitions: JsonSchema[]) {
    this.writer.write('index.ts', index(routes));
    this.writer.write('plugin.ts', plugin(routes, definitions));
  }

  flush() {
    return this.writer.flush(this.onWrite);
  }
}
