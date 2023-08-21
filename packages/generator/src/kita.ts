import { globSync } from 'glob';
import ts from 'typescript';
import type { KitaConfig } from './config';
import { DuplicateOperationIdError, KitaError } from './errors';
import { KitaEmitter } from './events';
import type { BaseProvider, BaseRoute } from './models';
import { buildParameterParser } from './parameter-parsers';
import type { ParameterParser, RouteParser } from './parsers';
import { parseProvider } from './provider/parser';
import { buildRouteParser } from './route-parsers';
import { SchemaBuilder } from './schema/builder';
import { AstTraverser } from './traverser';
import { readCompilerOptions } from './util/tsconfig';

export class Kita extends KitaEmitter {
  readonly compilerOptions: ts.CompilerOptions;
  readonly controllerPaths: string[];
  readonly providerPaths: string[];
  readonly schemaBuilder: SchemaBuilder;
  readonly program: ts.Program;
  readonly traverser: AstTraverser;

  /** Root route parser */
  readonly routeParser: RouteParser;
  /** Root parameter parser */
  readonly parameterParser: ParameterParser;
  /** Root map of all registered providers */
  readonly providers: Map<string, BaseProvider> = new Map();

  constructor(readonly tsconfig: string, readonly config: KitaConfig, readonly cwd: string) {
    super();

    try {
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

      // Ast parsing
      this.traverser = new AstTraverser(this.routeParser, this.program);
    } catch (error) {
      this.handle(error);
    }
  }

  public async buildRoutes() {
    const sources = this.traverser.findSources(this.controllerPaths);

    const routes = new Map<string, BaseRoute>();

    for await (const route of this.traverser.parseRoutes(sources)) {
      if (!route) {
        continue;
      }

      if (route instanceof Error) {
        if (route instanceof KitaError) {
          route.suppress = true;
        }

        this.handle(route);

        continue;
      }

      // Checks for duplicate operation ids
      if (routes.has(route.schema.operationId)) {
        const previous = routes.get(route.schema.operationId)!;

        this.handle(
          new DuplicateOperationIdError(
            route.schema.operationId,
            previous.controllerPrettyPath,
            route.controllerPrettyPath
          )
        );

        continue;
      }

      this.emit('route', route);

      routes.set(route.schema.operationId, route);
    }

    return routes;
  }

  public async buildProviders() {
    const sources = this.traverser.findSources(this.providerPaths);

    for (const source of sources) {
      try {
        const provider = await parseProvider(source, this.parameterParser);

        // Handle duplicate provider types
        if (this.providers.has(provider.type)) {
          const previous = this.providers.get(provider.type)!;
          throw new DuplicateOperationIdError(provider.type, previous.providerPath, provider.providerPath);
        }

        this.emit('provider', provider);

        this.providers.set(provider.type, provider);
      } catch (error) {
        if (error instanceof KitaError) {
          error.suppress = true;
        }

        this.handle(error);
      }
    }

    return this.providers;
  }

  /**
   * Simple callback wrapper that will emit the error if it's a KitaError.
   */
  public handle(error: unknown): never | undefined {
    if (error instanceof KitaError) {
      this.emit('kita-error', error);

      // Error is handled in another way, no need to throw it.
      if (!error.suppress) {
        throw error;
      }

      return;
    }

    this.emit('error', error);

    throw error;
  }
}
