import type { KitaConfig } from '@kitajs/core';
import type { BaseRoute } from './routes/base';
import type { Schema } from '@kitajs/ts-json-schema-generator';

/**
 * This class is used to store all the data read from all codes.
 * 
 * A abstract syntax tree created f
 */
export class KitaAST {
  constructor(
    /** the kita config helps the generation */
    readonly config: KitaConfig,

    /** All generated routes */
    readonly routes: BaseRoute[] = [],

    /** All generated schemas */
    readonly schemas: Schema[] = [],

    /** All needed imports */
    readonly imports: string[] = []
  ) {}

  addImport(importPath: string) {
    if (!this.imports.includes(importPath)) {
      this.imports.push(importPath);
    }
  }
}
