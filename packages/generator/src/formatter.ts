import type { AstCollector, KitaConfig, SourceFormatter } from '@kitajs/common';
import fs from 'node:fs';
import path from 'node:path';
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
      collector.getSchemas(),
      path.relative(this.config.cwd, this.config.src)
    );

    if (this.config.format) {
      try {
        code = await prettier.format(code, {
          parser: 'typescript',

          // These options are here to improve prettier performance and reduce
          // final output size. As the file should not be committed to git and
          // ignored from formatters, we can safely ignore the user's prettier
          // configuration.
          printWidth: 999,
          tabWidth: 1,
          useTabs: true,
          semi: false,
          trailingComma: 'none',
          arrowParens: 'avoid',
          embeddedLanguageFormatting: 'off',
          quoteProps: 'preserve'
        });
      } catch (error: any) {
        // ignore formatting errors
      }
    }

    await fs.promises.writeFile(this.config.output, code, 'utf-8');
  }
}
