import Handlebars from 'handlebars';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ts } from 'ts-json-schema-generator';
import { KitaAST } from './ast';
import type { KitaConfig } from './config';
import { KitaError } from './errors';
import type { ParamResolver } from './parameters/base';
import { BodyResolver } from './parameters/body';
import { BodyPropResolver } from './parameters/body-prop';
import { ConnResolver } from './parameters/conn';
import { CookieResolver } from './parameters/cookie';
import { CustomResolver } from './parameters/custom';
import { HeaderResolver } from './parameters/header';
import { PathResolver } from './parameters/path';
import { QueryResolver } from './parameters/query';
import { RepResolver } from './parameters/rep';
import { ReqResolver } from './parameters/req';
import { ThisResolver } from './parameters/this';
import { AsyncResolver } from './routes/async';
import { RouteResolver } from './routes/base';
import { RestResolver } from './routes/rest';
import { WebsocketResolver } from './routes/websocket';
import { SchemaStorage } from './schema-storage';
import { readCompilerOptions } from './util/tsconfig';

export class KitaGenerator {
  readonly routes: RouteResolver[] = [
    new AsyncResolver(),
    new RestResolver(),
    new WebsocketResolver()
  ];

  readonly params: ParamResolver[] = [
    new ThisResolver(),
    new ConnResolver(),
    new PathResolver(),
    new CookieResolver(),
    new BodyResolver(),
    new BodyPropResolver(),
    new QueryResolver(),
    new HeaderResolver(),
    new ReqResolver(),
    new RepResolver(),
    new CustomResolver()
  ];

  constructor(
    readonly rootPath: string,
    readonly config: KitaConfig,
    readonly controllerPaths: string[],
    readonly tsconfigPath = path.resolve(rootPath, config.tsconfig),
    readonly compilerOptions = readCompilerOptions(tsconfigPath),
    readonly outputPath = path.resolve(rootPath, config.routes.output),
    readonly outputFolder = path.dirname(outputPath),
    // TODO: Use ts.createIncrementalProgram to faster builds??
    readonly program = ts.createProgram(controllerPaths, compilerOptions),
    readonly schemaStorage = new SchemaStorage(config, program),
    readonly ast = new KitaAST(config)
  ) {
    config.onCreate?.(this);
  }

  /**
   * An util method that resolves the provided path into a relative path to the output file.
   */
  importablePath = (p: string) =>
    `./${path
      .relative(
        this.outputFolder,
        path.resolve(
          this.rootPath,
          // remove possible .ts extension
          p.replace(/\.(t|j)sx?$/, '')
        )
      )
      // replace windows backslashes with forward slashes
      .replace(/\\/g, '/')}`;

  async updateAst() {
    // Adds custom parameter resolver imports
    for (const [name, filepath] of Object.entries(this.config.params)) {
      this.ast.addImport(`import ${name} from '${this.importablePath(filepath)}';`);
    }

    // Populate data with controllers and routes info.
    const routeSources = this.controllerPaths.map((p) => {
      const sf = this.program.getSourceFile(p);

      if (!sf) {
        throw KitaError('Source file not found', [p]);
      }

      return sf;
    });

    const promises = [] as ReturnType<RouteResolver['resolve']>[];

    for (const source of routeSources) {
      ts.forEachChild(source, (node) => {
        promises.push(RouteResolver.resolveNode(node, source, this));
      });
    }

    for await (const route of promises) {
      if (!route) {
        continue;
      }

      // Searches for different route operationIds
      if (route.schema.operationId) {
        const search = this.ast.routes.find(
          (r) => r.schema.operationId === route.schema.operationId
        );

        if (search) {
          throw KitaError(`Duplicate operationId \`${route.schema.operationId}\``, [
            search.controllerPath,
            route.controllerPath
          ]);
        }
      }

      this.ast.routes.push(route);
    }

    // Include all generated definitions into the output file.
    this.schemaStorage.applyDefinitions(this.ast);

    // Sort routes by path
    this.ast.imports.sort();

    this.ast.loadControllers(this.importablePath);

    await this.config.onAstUpdate?.(this);
  }

  /** You can override this method to code your own way to generate this route string */
  async astToString() {
    const str = await fs.readFile(
      path.resolve(__dirname, '../templates/output.hbs'),
      'utf-8'
    );

    return Handlebars.compile(str, { noEscape: true })(this.ast);
  }
}
