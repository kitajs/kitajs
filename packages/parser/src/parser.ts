import {
  AstCollector,
  DuplicateOperationIdError,
  DuplicateProviderTypeError,
  JsonSchema,
  KitaError,
  Provider,
  ProviderParser,
  Route,
  SourceFormatter,
  UnknownKitaError,
  type KitaConfig,
  type ParameterParser,
  type RouteParser
} from '@kitajs/common';
import { KitaPlugin } from '@kitajs/common/dist/ast/plugin';
import { ts } from 'ts-json-schema-generator';
import { buildParameterParser } from './parameter-parsers';
import { buildProviderParser } from './provider-parsers';
import { buildRouteParser } from './route-parsers';
import { SchemaBuilder } from './schema/builder';
import { isExportedFunction } from './util/nodes';
import { traverseProviders, traverseStatements } from './util/traverser';

export class KitaParser implements AstCollector {
  protected readonly providers: Map<string, Provider> = new Map();
  protected readonly routes: Map<string, Route> = new Map();
  protected readonly plugins: Map<string, KitaPlugin> = new Map();
  protected readonly schemaBuilder: SchemaBuilder;

  readonly rootRouteParser: RouteParser;
  readonly rootParameterParser: ParameterParser;
  readonly rootProviderParser: ProviderParser;

  /**
   * Creates a KitaParser instance with the given config.
   *
   * You may pass a formatter to format the source code of the routes and providers.
   */
  static create(
    config: KitaConfig,
    compilerOptions: ts.CompilerOptions,
    rootNames: string[],
    formatter?: SourceFormatter
  ) {
    const parser = new KitaParser(
      config,
      ts.createProgram({
        options: compilerOptions,
        // Adds both providers and controllers
        rootNames: rootNames
      }),

      formatter
    );

    return parser;
  }

  static createWatcher(config: KitaConfig, compilerOptions: ts.CompilerOptions, formatter?: SourceFormatter) {
    const parser = {} as {
      ref: KitaParser;
      onChange?: (parser: KitaParser) => Promise<void>;
      onError?: (error: unknown) => void;
    };

    let watcher: ts.WatchOfConfigFile<ts.SemanticDiagnosticsBuilderProgram>;

    // Note that there is another overload for `createWatchCompilerHost` that takes
    // a set of root files.
    const host = ts.createWatchCompilerHost(
      config.tsconfig,
      compilerOptions,
      ts.sys,
      // No emit is needed
      ts.createSemanticDiagnosticsBuilderProgram,
      // Do not care if typescript code has problems
      () => {},
      (diagnostic) => {
        if (
          // Compilation successful
          diagnostic.code !== 6194 &&
          // Found X errors
          diagnostic.code !== 6193
        ) {
          return;
        }

        // Watcher not initialized yet
        if (!watcher) {
          return;
        }

        const program = watcher.getProgram().getProgram();

        try {
          parser.ref = new KitaParser(config, program, parser.ref.formatter);
        } catch (error) {
          const promise = parser.onChange?.(parser.ref);

          if (promise && parser.onError) {
            promise.catch(parser.onError);
          }
        }

        if (parser.onChange) {
          const promise = parser.onChange(parser.ref);

          if (promise && parser.onError) {
            promise.catch(parser.onError);
          }
        }
      },
      {
        excludeFiles: config.watch.ignore
      }
    );

    watcher = ts.createWatchProgram(host);

    try {
      parser.ref = new KitaParser(config, watcher.getProgram().getProgram(), formatter);
    } catch (error) {
      const promise = parser.onChange?.(parser.ref);

      if (promise && parser.onError) {
        promise.catch(parser.onError);
      }
    }

    // Make sure to call the onChange hook after the first parse
    setImmediate(() => {
      if (parser.onChange) {
        const promise = parser.onChange(parser.ref);

        if (promise && parser.onError) {
          promise.catch(parser.onError);
        }
      }
    });

    return parser;
  }

  constructor(
    protected readonly config: KitaConfig,
    protected readonly program: ts.Program,
    /** A source formatter to call every time a route is generated */
    protected readonly formatter?: SourceFormatter
  ) {
    // Json schema
    this.schemaBuilder = new SchemaBuilder(this.config, program);

    // Parsing
    this.rootParameterParser = buildParameterParser(this.config, this.schemaBuilder, this);
    this.rootProviderParser = buildProviderParser(this.config, this.rootParameterParser);
    this.rootRouteParser = buildRouteParser(
      this.config,
      this.schemaBuilder,
      this.rootParameterParser,
      this.program.getTypeChecker(),
      this
    );
  }

  async *parse() {
    const files = this.program.getSourceFiles().map((f) => f.fileName);

    // Parses all providers first
    for await (const provider of traverseProviders(
      this.program,
      this.rootProviderParser,
      files.filter((f) => f.startsWith(this.config.providerFolder))
    )) {
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
    }

    // Parses all routes
    for await (const result of traverseStatements(
      this.program,
      this.rootRouteParser,
      files.filter((f) => f.startsWith(this.config.routeFolder))
    )) {
      if (result instanceof KitaError) {
        yield result;
        continue;
      }

      if (result instanceof Error) {
        yield new UnknownKitaError(result.message, result);
        continue;
      }

      const route = result.parsed;
      const node = result.statement;

      const duplicated = this.routes.get(route.schema.operationId);

      if (duplicated) {
        yield new DuplicateOperationIdError(
          route.schema.operationId,
          //@ts-expect-error - it may not have a name
          node.name || node
        );

        // Tries to find the duplicated route in the source file
        // but there is no problem if it could not be found
        const duplicatedNode = this.program
          .getSourceFile(duplicated.relativePath)
          ?.statements.find((c) => isExportedFunction(c) && c.name?.getText() === duplicated.controllerMethod);

        if (duplicatedNode) {
          yield new DuplicateOperationIdError(
            duplicated.schema.operationId,
            //@ts-expect-error - it may not have a name
            duplicatedNode.name || duplicatedNode
          );
        }

        continue;
      }

      this.routes.set(route.schema.operationId, route);

      if (this.formatter) {
        const promise = this.formatter.generateRoute(route);

        // Only await if needs to
        if (promise) {
          await promise;
        }
      }
    }

    if (this.formatter) {
      const promise = this.formatter.generateRuntime(this);

      // Only await if needs to
      if (promise) {
        await promise;
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

  getProgram() {
    return this.program;
  }
}
