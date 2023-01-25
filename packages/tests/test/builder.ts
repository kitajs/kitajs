/* istanbul ignore file */
import {
  KitaAST,
  KitaConfig,
  KitaGenerator,
  findControllerPaths,
  findRouteName,
  mergeDefaults
} from '@kitajs/generator';
import type { DeepPartial } from '@kitajs/generator/dist/types';
import type { ProvidedRouteContext } from '@kitajs/runtime';
import deepmerge from 'deepmerge';
import { FastifyInstance, FastifyPluginAsync, InjectOptions, fastify } from 'fastify';
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
  Kita: FastifyPluginAsync<{ context: ProvidedRouteContext }>;
  config: KitaConfig;
  KitaAST: KitaAST;
  app: FastifyInstance;
}> {
  private filename!: string;
  private exports!: any;

  /**
   * Builds the routes file, runs it and return a fastify instance with it registered.
   */
  static build(
    /** The file to test */
    filename: string,
    /** The exports of the file to test */
    exports: object,
    /** The config to use */
    cfg: DeepPartial<KitaConfig> = {},
    /** The context to pass to the routes */
    context: ProvidedRouteContext = {}
  ) {
    // escapes path variables
    filename = filename.replace(/(\[|\])/g, '\\$1');

    const kita = new KitaTestBuilder(async (res) => {
      let config = mergeDefaults(
        deepmerge(
          {
            controllers: { glob: [filename], prefix: TEST_DIRNAME + '/' },
            tsconfig: require.resolve('../tsconfig.json'),
            routes: { output: TEST_FILENAME }
          },
          cfg
        )
      );

      const controllersPaths = await findControllerPaths(
        config.controllers.glob,
        TEST_DIRNAME
      );

      const kita = new KitaGenerator(TEST_DIRNAME, config, controllersPaths);
      await kita.updateAst();

      const typescriptCode = await kita.astToString();
      let { outputText } = ts.transpileModule(typescriptCode, TRANSPILE_OPTIONS);

      // This is a hack to get the transpiled code to run in the same context as this file
      // making code coverage work properly
      const exports: any = {};
      eval(outputText);

      config = exports.config;
      const Kita = exports.Kita as FastifyPluginAsync<{ context: ProvidedRouteContext }>;
      const KitaAST = exports.KitaAST as KitaAST;

      // Creates the fastify instance and registers the routes
      const app = fastify({ ajv: { customOptions: { allowUnionTypes: true } } });
      app.register(Kita, { context });

      return res({
        app,
        Kita,
        config,
        KitaAST
      });
    });

    kita.filename = filename;
    kita.exports = exports;

    return kita;
  }

  async inject(
    /** the route to test */
    fn: Function,
    /** params for the request */
    inject: InjectOptions = {}
  ) {
    const self = await this;

    // Sets the default values for the inject options
    inject.method ??= fn.name.toUpperCase() as 'GET';
    inject.url ??= findRouteName(this.filename, self.config).routePath;

    // Creates a spy to check if the route was called
    const spy = jest.spyOn(this.exports, fn.name);

    const response = await self.app.inject(inject);

    expect(spy).toHaveBeenCalled();

    return response;
  }
}
