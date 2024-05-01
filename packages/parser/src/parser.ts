import {
  DuplicateOperationIdError,
  DuplicateProviderTypeError,
  KitaError,
  UnknownKitaError,
  kProvidersFolder,
  kRoutesFolder,
  type AstCollector,
  type JsonSchema,
  type KitaConfig,
  type ParameterParser,
  type Provider,
  type ProviderParser,
  type Route,
  type RouteParser
} from '@kitajs/common';
import type { KitaPlugin } from '@kitajs/common/dist/ast/plugin';
import path from 'node:path';
import { ts } from 'ts-json-schema-generator';
import { buildParameterParser } from './parameter-parsers';
import { buildProviderParser } from './provider-parsers';
import { buildRouteParser } from './route-parsers';
import { SchemaBuilder } from './schema/builder';
import { isExportedFunction } from './util/nodes';
import { toTsPath } from './util/paths';
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
  static create(config: KitaConfig, compilerOptions: ts.CompilerOptions, rootNames: string[]) {
    const parser = new KitaParser(
      config,
      ts.createProgram({
        options: compilerOptions,
        // Adds both providers and controllers
        rootNames: rootNames
      })
    );

    return parser;
  }

  static createWatcher(config: KitaConfig, compilerOptions: ts.CompilerOptions) {
    const parser = {} as {
      ref: KitaParser;
      onChange?: (parser: KitaParser) => void;
      onError?: (error: unknown) => void;
    };

    // biome-ignore lint/style/useConst: the watcher is reassigned
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
          parser.ref = new KitaParser(config, program);
        } catch (error) {
          try {
            parser.onChange?.(parser.ref);
          } catch (error) {
            if (parser.onError) {
              parser.onError(error);
            } else {
              throw error;
            }
          }
        }

        setImmediate(() => {
          try {
            parser.onChange?.(parser.ref);
          } catch (error) {
            if (parser.onError) {
              parser.onError(error);
            } else {
              throw error;
            }
          }
        });
      },
      {
        excludeFiles: config.watchIgnore
      }
    );

    watcher = ts.createWatchProgram(host);

    try {
      parser.ref = new KitaParser(config, watcher.getProgram().getProgram());
    } catch (error) {
      try {
        parser.onChange?.(parser.ref);
      } catch (error) {
        if (parser.onError) {
          parser.onError(error);
        } else {
          throw error;
        }
      }
    }

    // Make sure to call the onChange hook after the first parse
    setImmediate(() => {
      try {
        parser.onChange?.(parser.ref);
      } catch (error) {
        if (parser.onError) {
          parser.onError(error);
        } else {
          throw error;
        }
      }
    });

    return parser;
  }

  constructor(
    protected readonly config: KitaConfig,
    protected readonly program: ts.Program
  ) {
    // Json schema
    this.schemaBuilder = new SchemaBuilder(this.config, program);

    // Parsing
    this.rootParameterParser = buildParameterParser(this.config, this.schemaBuilder, this);
    this.rootProviderParser = buildProviderParser(
      this.config,
      this.rootParameterParser,
      this.program.getTypeChecker(),
      this.schemaBuilder
    );
    this.rootRouteParser = buildRouteParser(
      this.config,
      this.schemaBuilder,
      this.rootParameterParser,
      this.program.getTypeChecker(),
      this
    );
  }

  *parse() {
    const files = this.program.getSourceFiles().map((f) => f.fileName);

    // Parses all providers first
    for (const provider of traverseProviders(
      this.program,
      this.rootProviderParser,
      files.filter((f) => f.startsWith(toTsPath(path.join(this.config.src, kProvidersFolder))))
    )) {
      if (provider instanceof KitaError) {
        yield provider;
        continue;
      }

      if (provider instanceof Error) {
        yield new UnknownKitaError(provider.message, provider);
        continue;
      }

      // Ignore providers that resolved elsewhere, like in a plugin
      if (!provider) {
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
    for (const result of traverseStatements(
      this.program,
      this.rootRouteParser,
      files.filter((f) => f.startsWith(toTsPath(path.join(this.config.src, kRoutesFolder))))
    )) {
      if (result instanceof KitaError) {
        yield result;
        continue;
      }

      if (result instanceof Error) {
        yield new UnknownKitaError(String(result), result);
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
    }
  }

  getProvider(name: string): Provider | undefined {
    return this.providers.get(name);
  }

  getProviders(): Provider[] {
    return Array.from(this.providers.values());
  }

  getProviderCount(): number {
    return this.providers.size;
  }

  getRoute(operationId: string): Route | undefined {
    return this.routes.get(operationId);
  }

  getRoutes(): Route[] {
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

  getProgram(): ts.Program {
    return this.program;
  }
}
