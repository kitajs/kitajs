import { KitaConfig, Route, RuntimeNotFoundError, SourceFormatter, readCompilerOptions } from '@kitajs/common';
import path from 'path';
import { Definition } from 'ts-json-schema-generator';
import ts from 'typescript';
import { index } from './templates';
import { plugin } from './templates/plugin';
import { route } from './templates/route';
import { schemas } from './templates/schema';
import { KitaWriter } from './writer';

export class KitaFormatter implements SourceFormatter {
  readonly writer: KitaWriter;

  /** Generated working directory */
  readonly gwd: string;

  constructor(
    readonly config: KitaConfig,
    compilerOptions: ts.CompilerOptions = readCompilerOptions(config.tsconfig)
  ) {
    this.gwd = this.config.runtime
      ? path.resolve(config.cwd, this.config.runtime)
      : path.dirname(require.resolve('@kitajs/runtime/generated'));

    if (!ts.sys.directoryExists(this.gwd)) {
      throw new RuntimeNotFoundError(this.gwd);
    }

    this.writer = new KitaWriter(compilerOptions, this.gwd);
  }

  generateRoute(r: Route) {
    const filename = `routes/${r.schema.operationId}.ts`;
    this.writer.write(filename, route(r, path.resolve(this.gwd, filename)));
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
