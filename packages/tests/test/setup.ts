/* istanbul ignore file */
import {
  KitaAST,
  KitaGenerator,
  findControllerPaths,
  findRouteName,
  mergeDefaults
} from '@kitajs/generator';
import type { ProvidedRouteContext } from '@kitajs/runtime';
import {
  FastifyPluginAsync,
  InjectOptions,
  LightMyRequestResponse,
  fastify
} from 'fastify';
import ts from 'typescript';
import { isMainThread } from 'worker_threads';

/**
 * Builds the routes file, runs it and return a fastify instance with it registered.
 */
export async function generateKitaRoute(
  __filename: string,
  context: ProvidedRouteContext
) {
  let config = mergeDefaults({
    controllers: { glob: [__filename], prefix: __dirname + '/' },
    tsconfig: require.resolve('../tsconfig.json')
  });

  const controllersPaths = await findControllerPaths(config.controllers.glob, __dirname);
  const kita = new KitaGenerator(__dirname, config, controllersPaths);
  await kita.updateAst();

  const typescriptCode = await kita.astToString();
  let { outputText } = ts.transpileModule(typescriptCode, {
    compilerOptions: {
      importHelpers: true,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.CommonJS
    }
  });
  outputText = outputText.replace('./..', '.');

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
  app.setErrorHandler((err) => expect(err).toBeUndefined());

  return {
    app,
    Kita,
    config,
    KitaAST
  };
}

export type TestRouteParams = {
  /** the route to test */
  fn: Function;
  /** used to generate the kita route */
  __filename: string;
  /** used to generate the kita route */
  exports: any;
  /** called whenever the AST is generated */
  onAst?: (ast: KitaAST) => void | Promise<void>;
  /** called whenever the route returned a response */
  onResponse?: (res: LightMyRequestResponse) => void | Promise<void>;
  /** params for the request */
  inject?: InjectOptions;
};

/**
 * Creates a test case for a kitajs route.
 */
export function testRoute({
  fn,
  __filename,
  exports,
  onAst,
  onResponse,
  inject = {}
}: TestRouteParams): void {
  /**
   * Async routes may call this method on a worker thread, which jest is not available
   */
  if (!isMainThread) {
    return;
  }

  // Creates a new test case
  it(`Tests ${fn.name}() route`, async () => {
    const { app, KitaAST, config } = await generateKitaRoute(__filename, {});

    // Calls the hook for AST checks
    if (onAst) {
      await onAst(KitaAST);
    }

    // Sets the default values for the inject options
    inject.method ??= fn.name.toUpperCase() as 'GET';
    inject.url ??= findRouteName(__filename, config).routePath;

    // Creates a spy to check if the route was called
    const spy = jest.spyOn(exports, fn.name);

    // Injects the request
    const response = await app.inject(inject);

    // Calls the hook for response checks
    if (onResponse) {
      await onResponse(response);
    }

    expect(response.statusCode).toBeGreaterThan(199);
    expect(response.statusCode).toBeLessThan(300);

    // Ensures the route was called
    expect(spy).toHaveBeenCalled();
  });
}
