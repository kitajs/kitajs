import {
  DuplicateOperationIdError,
  DuplicateProviderTypeError,
  KitaError,
  KitaEventEmitter,
  ProviderParser,
  Route,
  readCompilerOptions,
  type KitaConfig,
  type ParameterParser,
  type Provider,
  type RouteParser
} from '@kitajs/common';
import { globSync } from 'glob';
import ts from 'typescript';
import { buildParameterParser } from './parameter-parsers';
import { buildRouteParser } from './route-parsers';
import { SchemaBuilder } from './schema/builder';
import { traverseSource, traverseStatements } from './util/traverser';

export class KitaParser {
  readonly compilerOptions: ts.CompilerOptions;
  readonly controllerPaths: string[];
  readonly providerPaths: string[];
  readonly schemaBuilder: SchemaBuilder;
  readonly program: ts.Program;
  // readonly traverser: AstTraverser;

  /** Root route parser */
  readonly routeParser: RouteParser;
  /** Root parameter parser */
  readonly parameterParser: ParameterParser;
  /** Root provider parser */
  readonly providerParser: ProviderParser;
  /** Root map of all registered providers */
  readonly providers: Map<string, Provider> = new Map();
  /** Root map of all registered routes */
  readonly routes: Map<string, Route> = new Map();

  constructor(
    readonly tsconfig: string,
    readonly config: KitaConfig,
    readonly cwd: string,
    readonly emitter: KitaEventEmitter
  ) {
    this.controllerPaths = globSync(config.controllers.glob, { cwd });
    this.providerPaths = globSync(config.providers.glob, { cwd });

    // Typescript program
    this.compilerOptions = readCompilerOptions(tsconfig);
    this.program = ts.createProgram(
      // Adds both providers and controllers
      this.controllerPaths.concat(this.providerPaths),
      this.compilerOptions
    );

    // Json schema
    this.schemaBuilder = new SchemaBuilder(config, this.program);

    // Parsing
    this.parameterParser = buildParameterParser(config, this.schemaBuilder, this);
    this.routeParser = buildRouteParser(
      config,
      this.schemaBuilder,
      this.parameterParser,
      this.program.getTypeChecker()
    );
  }

  async parseRoutes() {
    for await (const route of traverseStatements(this.program, this.routeParser, this.controllerPaths)) {
      if (this.handlePossibleError(route)) {
        continue;
      }

      const duplicated = this.routes.get(route.schema.operationId);

      if (duplicated) {
        this.handlePossibleError(
          new DuplicateOperationIdError(
            route.schema.operationId,
            duplicated.controllerPrettyPath,
            route.controllerPrettyPath
          )
        );

        continue;
      }

      this.emitter.emit('route', route);
      this.routes.set(route.schema.operationId, route);
    }
  }

  async parseProviders() {
    for await (const provider of traverseSource(this.program, this.providerParser, this.providerPaths)) {
      if (this.handlePossibleError(provider)) {
        continue;
      }

      const duplicated = this.providers.get(provider.type);

      if (duplicated) {
        this.handlePossibleError(
          new DuplicateProviderTypeError(provider.type, duplicated.providerPrettyPath, provider.providerPrettyPath)
        );

        continue;
      }

      this.emitter.emit('provider', provider);
      this.providers.set(provider.type, provider);
    }
  }

  /**
   * If the provided object is an error, it will be handled by the parser and emit
   * the corresponding event. Otherwise, it will be returned as is.
   *
   * @returns Whether the object as an error or not.
   */
  public handlePossibleError(error: unknown, forceSuppress = false): error is Error {
    if (error instanceof KitaError) {
      this.emitter.emit('kitaError', error);

      if (!forceSuppress && !error.suppress) {
        throw error;
      }

      return true;
    }

    if (error instanceof Error) {
      this.emitter.emit('unknownError', error);

      if (!forceSuppress) {
        throw error;
      }

      return true;
    }

    return false;
  }
}
