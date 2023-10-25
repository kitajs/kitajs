import {
  AstCollector,
  DuplicateOperationIdError,
  DuplicateProviderTypeError,
  JsonSchema,
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
import { KitaPlugin } from '@kitajs/common/dist/ast/plugin';
import { ts } from 'ts-json-schema-generator';
import { Promisable } from 'type-fest';
import { buildParameterParser } from './parameter-parsers';
import { buildProviderParser } from './provider-parsers';
import { buildRouteParser } from './route-parsers';
import { SchemaBuilder } from './schema/builder';
import { walk } from './util/paths';
import { traverseSource, traverseStatements } from './util/traverser';

export class KitaParser implements AstCollector {
  protected readonly providers: Map<string, Provider> = new Map();
  protected readonly routes: Map<string, Route> = new Map();
  protected readonly plugins: Map<string, KitaPlugin> = new Map();
  protected readonly schemaBuilder: SchemaBuilder;

  readonly rootRouteParser: RouteParser;
  readonly rootParameterParser: ParameterParser;
  readonly rootProviderParser: ProviderParser;

  onRoute?: (r: Route) => Promisable<void>;
  onSchema?: (r: JsonSchema) => Promisable<void>;
  onProvider?: (r: Provider) => Promisable<void>;

  /** Creates a KitaParser instance with the given config. */
  static create(config: KitaConfig, compilerOptions: ts.CompilerOptions = readCompilerOptions(config.tsconfig)) {
    const routePaths = walk(config.routeFolder);
    const providerPaths = walk(config.providerFolder);

    // Typescript program
    const program = ts.createIncrementalProgram({
      options: compilerOptions,
      // Adds both providers and controllers
      rootNames: routePaths.concat(providerPaths)
    });

    return new KitaParser(config, routePaths, providerPaths, program);
  }

  constructor(
    protected readonly config: KitaConfig,
    readonly routePaths: string[],
    readonly providerPaths: string[],
    protected readonly program: ts.EmitAndSemanticDiagnosticsBuilderProgram | ts.Program
  ) {
    const realProgram = 'getProgram' in program ? program.getProgram() : program;

    // Json schema
    this.schemaBuilder = new SchemaBuilder(this.config, realProgram, this);

    // Parsing
    this.rootParameterParser = buildParameterParser(this.config, this.schemaBuilder, this);
    this.rootRouteParser = buildRouteParser(
      this.config,
      this.schemaBuilder,
      this.rootParameterParser,
      realProgram.getTypeChecker(),
      this
    );
    this.rootProviderParser = buildProviderParser(this.config, this.rootParameterParser);
  }

  async *parse(routePaths?: string[], providerPaths?: string[]) {
    if (routePaths || providerPaths) {
      throw new UnknownKitaError('Custom controller and provider paths are not supported in this generator');
    }

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
        yield new DuplicateProviderTypeError(provider.type, duplicated.providerPath, provider.providerPath);
        continue;
      }

      this.providers.set(provider.type, provider);

      // Call route callback if present
      if (this.onProvider) {
        const promise = this.onProvider(provider);

        // Only await if needs to
        if (promise) {
          await promise;
        }
      }
    }

    // Parses all routes
    for await (const route of traverseStatements(this.program, this.rootRouteParser, this.routePaths)) {
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
        yield new DuplicateOperationIdError(route.schema.operationId, duplicated.controllerPath, route.controllerPath);
        continue;
      }

      this.routes.set(route.schema.operationId, route);

      // Call route callback if present
      if (this.onRoute) {
        const promise = this.onRoute(route);

        // Only await if needs to
        if (promise) {
          await promise;
        }
      }
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

  getSchema(ref: string): JsonSchema | undefined {
    return this.schemaBuilder.getDefinition(ref);
  }

  getSchemas(): JsonSchema[] {
    return this.schemaBuilder.toSchemaArray();
  }

  getSchemaCount(): number {
    return this.schemaBuilder.getDefinitionCount();
  }

  getPlugin(name: string): KitaPlugin | undefined {
    return this.plugins.get(name);
  }

  getPlugins(): KitaPlugin[] {
    return Array.from(this.plugins.values());
  }

  getPluginCount(): number {
    return this.plugins.size;
  }

  addPlugin(name: string, plugin: KitaPlugin): void {
    this.plugins.set(name, plugin);
  }
}
