import { JsonSchema, KitaConfig, Route, SourceFormatter } from '@kitajs/common';
import { KitaPlugin } from '@kitajs/common/dist/ast/plugin';
import fs from 'fs';
import path from 'path';
import { generateIndex } from './templates';
import { generatePlugin } from './templates/plugin';
import { generateRoute } from './templates/route';

export class KitaFormatter implements SourceFormatter {
  private readonly outDir: string;

  constructor(readonly config: KitaConfig) {
    if (this.config.runtimePath) {
      this.outDir = path.resolve(this.config.cwd, this.config.runtimePath);
    } else {
      this.outDir = path.join(
        // Joined @kitajs/runtime and generated separately because when
        // resolve is called on a package name (instead of folder if it was @kitajs/runtime/generated)
        // it will look only for the package.json and resolve from there.
        path.dirname(
          // Allows global installations to work
          require.resolve('@kitajs/runtime', { paths: [this.config.cwd] })
        ),
        'generated'
      );
    }
  }

  async generateRoute(route: Route) {
    const file = generateRoute(route, this.config.cwd);

    // The route may be in a deep folder
    await fs.promises.mkdir(path.join(this.outDir, path.dirname(file.source.filename)), { recursive: true });

    await fs.promises.writeFile(path.join(this.outDir, file.source.filename), file.source.content);

    if (this.config.declaration) {
      await fs.promises.writeFile(path.join(this.outDir, file.types.filename), file.types.content);
    }
  }

  async generateRuntime(routes: Route[], definitions: JsonSchema[], plugins: KitaPlugin[]) {
    const index = generateIndex(routes);
    const plugin = generatePlugin(routes, definitions, plugins);

    await Promise.all([
      fs.promises.writeFile(path.join(this.outDir, index.source.filename), index.source.content),
      fs.promises.writeFile(path.join(this.outDir, plugin.source.filename), plugin.source.content)
    ]);

    if (this.config.declaration) {
      await Promise.all([
        fs.promises.writeFile(path.join(this.outDir, index.types.filename), index.types.content),
        fs.promises.writeFile(path.join(this.outDir, plugin.types.filename), plugin.types.content)
      ]);
    }
  }
}
