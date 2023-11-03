import { AstCollector, KitaConfig, Route, SourceFormatter } from '@kitajs/common';
import fs from 'fs';
import path from 'path';
import { TsFile } from 'ts-writer';
import { generateIndex } from './templates';
import { generatePlugin } from './templates/plugin';
import { generateRoute } from './templates/route';

export class KitaFormatter implements SourceFormatter {
  private files: TsFile[] = [];

  constructor(readonly config: KitaConfig) {}

  generateRoute(route: Route) {
    this.files.push(generateRoute(route, this.config.cwd));
  }

  generateRuntime(collector: AstCollector) {
    this.files.push(generateIndex(collector.getRoutes()));
    this.files.push(generatePlugin(collector.getRoutes(), collector.getSchemas(), collector.getPlugins()));
  }

  async flush() {
    const files = this.files.flatMap((file) => (this.config.declaration ? [file.source, file.types] : file.source));

    // Make sure all directories exists
    const dirs = files.map((f) => path.dirname(f.filename)).filter((v, i, a) => a.indexOf(v) === i);
    await Promise.all(
      dirs.map((dir) => fs.promises.mkdir(path.join(this.config.runtimePath, dir), { recursive: true }))
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
