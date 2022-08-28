import { createConfigExplorer, KitaConfig, mergeDefaults } from '@kitajs/core';
import minimatch from 'minimatch';
import path from 'node:path';
import prettier from 'prettier';
import ts from 'typescript';
import { GeneratorResult } from './generator-data';
import { compileTemplate } from './hbs/compile';
import './hbs/helpers';
import { SchemaStorage } from './json-generator';
import { visitNode } from './node-visitor';
import { findControllerPaths } from './util/controller-paths';
import { forEachChild } from './util/for-each-child-async';
import { readTsconfig } from './util/tsconfig';

export class KitaGenerator {
  readonly outputPath: string;
  private outputFolder: string;

  private tsconfigPath: string;
  private compilerOptions: ts.CompilerOptions;

  private controllerPaths!: string[];
  public program!: ts.Program;
  public schemaStorage!: SchemaStorage;

  private hbsTemplate!: HandlebarsTemplateDelegate<GeneratorResult>;

  constructor(readonly rootPath: string, readonly kitaConfig: KitaConfig) {
    this.outputPath = path.resolve(rootPath, kitaConfig.routes.output);
    this.outputFolder = path.dirname(this.outputPath);

    this.tsconfigPath = path.resolve(rootPath, kitaConfig.tsconfig);
    this.compilerOptions = readTsconfig(this.tsconfigPath);

    this.hbsTemplate = compileTemplate(this.kitaConfig.routes.template, this.rootPath);
  }

  static async build(): Promise<KitaGenerator> {
    let rootPath = process.cwd();
    let config: KitaConfig = mergeDefaults({});

    {
      const cfg = await createConfigExplorer();

      if (cfg) {
        rootPath = path.dirname(cfg.filepath);
        config = mergeDefaults(cfg.config);
      }
    }

    const kg = new KitaGenerator(rootPath, config);

    kg.controllerPaths = await findControllerPaths(
      kg.kitaConfig.controllers.glob,
      kg.rootPath
    );

    kg.program = ts.createProgram(kg.controllerPaths, kg.compilerOptions);
    kg.schemaStorage = new SchemaStorage(kg.tsconfigPath, kg.program);

    return kg;
  }

  async generate() {
    const result = new GeneratorResult(this.kitaConfig);

    {
      // Populate data with custom parameters resolvers.
      for (const [name, filepath] of Object.entries(this.kitaConfig.params)) {
        result.addImport(
          'params',
          // Should be default export
          `import ${name} from '${this.importablePath(filepath)}';`
        );
      }
    }

    {
      // Populate data with controllers and routes info.
      const sources = this.program.getSourceFiles().filter(
        (s) =>
          // Not a declaration file
          !s.isDeclarationFile &&
          // Not a controller file
          this.kitaConfig.controllers.glob.some((glob) => minimatch(s.fileName, glob))
      );

      await Promise.all(
        sources.map((src) =>
          forEachChild(src, (node) => visitNode(node, src, this, result))
        )
      );
    }

    // Checks for duplicate operationIds.
    {
      const duplicates = result.routes.filter(
        (r, i, arr) => arr.findIndex((r2) => r2.operationId === r.operationId) !== i
      );

      for (const duplicate of duplicates) {
        throw new Error(
          `Duplicate operationId "${duplicate.operationId}" at ${duplicate.controllerFile}`
        );
      }
    }

    {
      // Saves the whole json schema
      result.saveSchema(this.schemaStorage);
    }

    return result;
  }

  /** Returns a output importable path */
  importablePath = (filepath: string) => {
    // remove possible .ts extension
    filepath = filepath.replace(/\.ts$/, '');

    return './' + path.relative(this.outputFolder, path.resolve(this.rootPath, filepath));
  };

  async generateFile(result: GeneratorResult) {
    const output = this.hbsTemplate(result);

    try {
      const formatted = prettier.format(output, {
        parser: 'typescript',

        //TODO: Customize prettier config
        arrowParens: 'always',
        bracketSpacing: true,
        endOfLine: 'lf',
        insertPragma: false,
        bracketSameLine: false,
        jsxSingleQuote: false,
        printWidth: 90,
        proseWrap: 'always',
        quoteProps: 'as-needed',
        requirePragma: false,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'none',
        useTabs: false
      });

      return formatted;
    } catch (err) {
      console.error('Emitted code is not valid!!!');

      return output;
    }
  }
}
