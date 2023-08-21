import {
  findControllerPaths,
  findRouteName,
  KitaAST,
  KitaConfig,
  KitaGenerator,
  mergeDefaults
} from '@kitajs/generator';
import type { DeepPartial } from '@kitajs/generator/dist/types';
import deepmerge from 'deepmerge';
import { fastify, FastifyInstance, FastifyPluginAsync, InjectOptions, LightMyRequestResponse } from 'fastify';
import fs from 'fs/promises';
import prettier from 'prettier';
import ts from 'typescript';

const TEST_DIRNAME = __dirname;
const TEST_FILENAME = __filename;

const TRANSPILE_OPTIONS: ts.TranspileOptions = {
  compilerOptions: {
    importHelpers: true,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.CommonJS
  }
};

export class KitaTestBuilder extends Promise<{
  Kita: FastifyPluginAsync;
  config: KitaConfig;
  KitaAST: KitaAST;
  app: FastifyInstance;
  exported: unknown;
}> {
  private filename!: string;
  private exports!: any;

  /**
   * Builds the routes file, runs it and return a fastify instance with it registered.
   */
  static build(
    /** The file to test */
    originalFilename: string,
    /** The exports of the file to test */
    exports: object,
    /** The config to use */
    cfg: DeepPartial<KitaConfig> = {}
  ) {
    // escapes path variables
    const filename = originalFilename.replace(/(\[|\])/g, '\\$1');

    const kita = new KitaTestBuilder(async (res) => {
      let config = mergeDefaults(
        deepmerge(
          {
            controllers: { glob: [filename], prefix: TEST_DIRNAME + '/' },
            tsconfig: require.resolve('../tsconfig.json'),
            routes: {
              output: TEST_FILENAME,
              exportAST: true,
              exportConfig: true
            }
          },
          cfg
        )
      );

      const controllersPaths = await findControllerPaths(config.controllers.glob, TEST_DIRNAME);

      const kita = new KitaGenerator(TEST_DIRNAME, config, controllersPaths);
      await kita.updateAst();

      const typescriptCode = await kita.astToString();

      if (!process.env.CI) {
        // writes output to .kita.ts file
        await fs.writeFile(
          originalFilename.replace('.test.ts', '.kita.ts'),
          `//@ts-nocheck\n` +
            prettier.format(typescriptCode, {
              parser: 'typescript',
              ...require('../../../.prettierrc.js')
            })
        );
      }

      let { outputText } = ts.transpileModule(typescriptCode, TRANSPILE_OPTIONS);

      // This is a hack to get the transpiled code to run in the same context as this file
      // making code coverage work properly
      const exports: any = {};
      eval(outputText);

      config = exports.ResolvedConfig;
      const Kita = exports.Kita as FastifyPluginAsync;
      const KitaAST = exports.KitaAST as KitaAST;

      // Creates the fastify instance and registers the routes
      const app = fastify({ ajv: { customOptions: { allowUnionTypes: true } } });
      app.register(Kita);

      return res({
        app,
        Kita,
        config,
        KitaAST,
        exported: exports
      });
    });

    kita.filename = filename;
    kita.exports = exports;

    return kita;
  }

  async inject<F extends (...args: any) => any>(
    /** the route to test */
    fn: F,
    /** params for the request */
    inject: InjectOptions = {}
  ): Promise<Omit<LightMyRequestResponse, 'json'> & { json: () => Awaited<ReturnType<F>> }> {
    const self = await this;

    // Sets the default values for the inject options
    inject.method ??= fn.name.toUpperCase() as 'GET';
    inject.url ??= findRouteName(this.filename, self.config).routePath;

    // Creates a spy to check if the route was called
    const spy = jest.spyOn(this.exports, fn.name);

    const response = await self.app.inject(inject);

    try {
      expect(spy).toHaveBeenCalled();
    } catch (err) {
      console.log(response.json());
      throw err;
    }

    return response;
  }
}
