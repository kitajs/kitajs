import { createConfigExplorer, KitaConfig, mergeDefaults } from '@kita/core';
import minimatch from 'minimatch';
import path from 'node:path';
import prettier from 'prettier';
import ts from 'typescript';
import { GeneratorResult } from './generator-data';
import { compileTemplate } from './hbs/compile';
import './hbs/helpers';
import { JsonGenerator } from './json-generator';
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
  private program!: ts.Program;
  public jsonGenerator!: JsonGenerator;

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
    kg.jsonGenerator = new JsonGenerator(kg.tsconfigPath, kg.program);

    return kg;
  }

  async generate() {
    const data = new GeneratorResult(this.kitaConfig);

    {
      // Populate data with custom parameters resolvers.
      for (const [name, filepath] of Object.entries(this.kitaConfig.params)) {
        data.addImport(
          'params',
          // Should be default export
          `import ${name} from '${this.importablePath(filepath)}';`
        );
      }
    }

    {
      const sources = this.program.getSourceFiles().filter(
        (s) =>
          // Not a declaration file
          !s.isDeclarationFile &&
          // Not a controller file
          this.kitaConfig.controllers.glob.some((glob) => minimatch(s.fileName, glob))
      );

      // Populate data with controllers and routes info.

      await Promise.all(
        sources.map((src) =>
          forEachChild(src, (node) => visitNode(node, src, this, data))
        )
      );
    }

    return data;
  }

  /** Returns a output importable path */
  importablePath = (filepath: string) => {
    // remove possible .ts extension
    filepath = filepath.replace(/\.ts$/, '');

    return './' + path.relative(this.outputFolder, path.resolve(this.rootPath, filepath));
  };

  async generateFile(result: GeneratorResult) {
    const output = this.hbsTemplate(result);

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
  }
}
