import {
  AstCollector,
  DuplicateOperationIdError,
  DuplicateProviderTypeError,
  KitaError,
  Provider,
  ProviderParser,
  Route,
  UnknownKitaError,
  readCompilerOptions,
  type KitaConfig,
  type ParameterParser,
  type RouteParser
} from '@kitajs/common';
import { globSync } from 'glob';
import { Definition } from 'ts-json-schema-generator';
import ts from 'typescript';
import { buildParameterParser } from './parameter-parsers';
import { buildProviderParser } from './provider-parsers';
import { buildRouteParser } from './route-parsers';
import { SchemaBuilder } from './schema/builder';
import { traverseSource, traverseStatements } from './util/traverser';

export class KitaParser implements AstCollector {
  protected readonly providers: Map<string, Provider> = new Map();
  protected readonly routes: Map<string, Route> = new Map();
  protected readonly schemaBuilder: SchemaBuilder;

  protected readonly rootRouteParser: RouteParser;
  protected readonly rootParameterParser: ParameterParser;
  protected readonly rootProviderParser: ProviderParser;

  /** Creates a KitaParser instance with the given config. */
  static create(config: KitaConfig) {
    const controllerPaths = globSync(config.controllers.glob, { cwd: config.cwd });
    const providerPaths = globSync(config.providers.glob, { cwd: config.cwd });

    // Typescript program
    const compilerOptions = readCompilerOptions(config.tsconfig);
    const program = ts.createProgram(
      // Adds both providers and controllers
      controllerPaths.concat(providerPaths),
      compilerOptions
    );

    return new KitaParser(config, controllerPaths, providerPaths, program);
  }

  constructor(
    protected readonly config: KitaConfig,
    protected readonly controllerPaths: string[],
    protected readonly providerPaths: string[],
    protected readonly program: ts.Program
  ) {
    // Json schema
    this.schemaBuilder = new SchemaBuilder(this.config, this.program);

    // Parsing
    this.rootParameterParser = buildParameterParser(this.config, this.schemaBuilder, this);
    this.rootRouteParser = buildRouteParser(
      this.config,
      this.schemaBuilder,
      this.rootParameterParser,
      this.program.getTypeChecker()
    );
    this.rootProviderParser = buildProviderParser(this.config, this.rootParameterParser);
  }

  async *parse() {
    // Parses all providers first
    for await (const provider of traverseSource(this.program, this.rootProviderParser, this.providerPaths)) {
      if (provider instanceof KitaError) {
        yield provider;
        continue;
      }

      if (provider instanceof Error) {
        yield new UnknownKitaError(provider.message, provider);
        continue;
      }

      const duplicated = this.providers.get(provider.type);

      if (duplicated) {
        yield new DuplicateProviderTypeError(provider.type, duplicated.providerPrettyPath, provider.providerPrettyPath);
        continue;
      }

      this.providers.set(provider.type, provider);
    }

    // Parses all routes
    for await (const route of traverseStatements(this.program, this.rootRouteParser, this.controllerPaths)) {
      if (route instanceof KitaError) {
        yield route;
        continue;
      }

      if (route instanceof Error) {
        yield new UnknownKitaError(route.message, route);
        continue;
      }

      const duplicated = this.routes.get(route.schema.operationId);

      if (duplicated) {
        yield new DuplicateOperationIdError(
          route.schema.operationId,
          duplicated.controllerPrettyPath,
          route.controllerPrettyPath
        );

        continue;
      }

      this.routes.set(route.schema.operationId, route);
    }
  }

  getProvider(name: string) {
    return this.providers.get(name);
  }

  getProviders() {
    return Array.from(this.providers.values());
  }

  getProviderCount(): number {
    return this.providers.size;
  }

  getRoute(operationId: string) {
    return this.routes.get(operationId);
  }

  getRoutes() {
    return Array.from(this.routes.values());
  }

  getRouteCount(): number {
    return this.routes.size;
  }

  getSchema(ref: string): Definition | undefined {
    return this.schemaBuilder.getDefinition(ref);
  }

  getSchemas(): Definition[] {
    return this.schemaBuilder.toSchemaArray();
  }

  getSchemaCount(): number {
    return this.schemaBuilder.getDefinitionCount();
  }
}
