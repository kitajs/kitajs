import fs from 'node:fs';
import path from 'node:path';
import type { AstCollector, KitaConfig, Route, SourceFormatter } from '@kitajs/common';
import type { TsFile } from 'ts-writer';
import { generateIndex } from './templates';
import { generatePlugin } from './templates/plugin';
import { generateRoute } from './templates/route';

export class KitaFormatter implements SourceFormatter {
  private files: TsFile[] = [];

  constructor(
    readonly config: KitaConfig,
    readonly typeOnly?: boolean
  ) {}

  generateRoute(route: Route, collector: AstCollector) {
    this.files.push(
      generateRoute(route, this.config.cwd, path.relative(this.config.cwd, this.config.src), collector.getProviders())
    );
  }

  generateRuntime(collector: AstCollector) {
    this.files.push(generateIndex(collector.getRoutes()));
    this.files.push(
      generatePlugin(
        collector.getRoutes(),
        collector.getSchemas(),
        collector.getPlugins(),
        collector.getProviders(),
        path.relative(this.config.cwd, this.config.src)
      )
    );
  }

  async flush() {
    const files = this.files.flatMap((file) =>
      this.typeOnly ? [file.types] : this.config.declaration ? [file.source, file.types] : file.source
    );

    // Tries to delete previous index.js and index.d.ts original files
    // Ignores errors
    await Promise.allSettled([
      fs.promises.unlink(path.join(this.config.runtimePath, 'index.js')),
      fs.promises.unlink(path.join(this.config.runtimePath, 'index.d.ts'))
    ]);

    // Make sure all directories exists
    const dirs = files.map((f) => path.dirname(f.filename)).filter((v, i, a) => a.indexOf(v) === i);
    await Promise.all(
      dirs.map((dir) =>
        fs.promises.mkdir(path.join(this.config.runtimePath, dir), {
          recursive: true
        })
      )
    );

    // Write all files
    await Promise.all(
      files.map((file) => fs.promises.writeFile(path.join(this.config.runtimePath, file.filename), file.content))
    );

    // Clear files
    const length = this.files.length;
    this.files = [];

    return this.config.declaration ? length * 2 : length;
  }
}
