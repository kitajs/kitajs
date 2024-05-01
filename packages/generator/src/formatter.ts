import type { AstCollector, KitaConfig, SourceFormatter } from '@kitajs/common';
import fs from 'node:fs';
import prettier from 'prettier';
import type ts from 'typescript';
import { generateKitaRuntime } from './generator';

export class KitaFormatter implements SourceFormatter {
  constructor(
    readonly config: KitaConfig,
    readonly compilerOptions: ts.CompilerOptions
  ) {}

  async generate(collector: AstCollector) {
    let code = generateKitaRuntime(
      collector.getRoutes(),
      collector.getPlugins(),
      collector.getProviders(),
      collector.getSchemas()
    );

    if (this.config.format) {
      try {
        code = await prettier.format(code, {
          parser: 'typescript'
        });
      } catch (error: any) {
        // ignore formatting errors
      }
    }

    await fs.promises.writeFile(this.config.output, code, 'utf-8');
  }
}
