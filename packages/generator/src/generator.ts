import type { KitaConfig } from '@kitajs/core';
import { ts } from '@kitajs/ts-json-schema-generator';
import Handlebars from 'handlebars';
import fs from 'node:fs/promises';
import path from 'node:path';
import { KitaAST } from './ast';
import type { BaseRoute } from './routes/base';
import { SchemaStorage } from './schema-storage';
import { readTsconfig } from './util/tsconfig';

export class KitaGenerator {
  private templateCache: Record<string, HandlebarsTemplateDelegate<BaseRoute>> = {};

  constructor(
    readonly rootPath: string,
    readonly config: KitaConfig,
    readonly controllerPaths: string[],
    readonly tsconfigPath = path.join(rootPath, config.tsconfig),
    readonly tsconfig = readTsconfig(tsconfigPath),
    readonly outputPath = path.join(rootPath, config.routes.output),
    readonly outputFolder = path.dirname(outputPath),
    readonly program = ts.createProgram(
      controllerPaths,
      (tsconfig.compilerOptions ??= {})
    ),
    readonly schemaStorage = new SchemaStorage(tsconfigPath, program),
    readonly ast = new KitaAST(config)
  ) {}

  /**
   * An util method that resolves the provided path into a relative path to the output file.
   */
  importablePath(p: string) {
    return `./${path.relative(
      this.outputFolder,
      // remove possible .ts extension
      path.resolve(this.rootPath, p.replace(/\.ts$/, ''))
    )}`;
  }

  /**
   * Returns the correct handlebars template renderer for the provided filepath.
   */
  async loadRenderer(filepath: string = 'output.hbs') {
    const template = require.resolve(path.join(this.config.templates, filepath));

    // Creates and compiles the new template, if it doesn't exist.
    if (!this.templateCache[template]) {
      const content = await fs.readFile(template, 'utf-8');
      this.templateCache[template] = Handlebars.compile(content, { noEscape: true });
    }

    return this.templateCache[template]!;
  }
}
