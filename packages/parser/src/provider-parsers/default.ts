import {
  ApplicationHookNames,
  InvalidProviderHookError,
  InvalidProviderSchemaTransformerError,
  KitaConfig,
  LifecycleHookNames,
  NoProviderExportedError,
  ParameterParser,
  Provider,
  ProviderParser,
  UntypedProviderError,
  WronglyTypedProviderError
} from '@kitajs/common';
import path from 'path';
import { ts } from 'ts-json-schema-generator';
import type { Promisable } from 'type-fest';
import {
  getTypeName,
  getTypeNodeName,
  isDefaultExportFunction,
  isExportedFunction,
  nodeNameEquals,
  unwrapPromiseType
} from '../util/nodes';
import { cwdRelative } from '../util/paths';
import { traverseParameters } from '../util/traverser';

export class DefaultProviderParser implements ProviderParser {
  constructor(
    private paramParser: ParameterParser,
    private config: KitaConfig
  ) {}

  /** Default provider handles all files. */
  supports(): Promisable<boolean> {
    return true;
  }

  async parse(source: ts.SourceFile): Promise<Provider> {
    const fn = source.statements.find(isDefaultExportFunction);

    if (!fn) {
      throw new NoProviderExportedError(source);
    }

    if (!fn.type) {
      throw new UntypedProviderError(fn.name || fn);
    }

    const returnType = unwrapPromiseType(fn.type);
    const async = fn.type !== returnType;
    const type = getTypeName(returnType);

    // Not a type reference.
    if (returnType.kind !== ts.SyntaxKind.TypeReference || !type) {
      throw new WronglyTypedProviderError(returnType);
    }

    const parameters = [];

    // Adds all parameters in their respective position
    for await (const { param, index } of traverseParameters(fn, this.paramParser, null)) {
      parameters[index] = param;
    }

    const [schemaTransformer] = this.searchHelper(source, ['transformSchema']);

    // validations
    if (schemaTransformer) {
      this.validateSchemaTransformer(schemaTransformer);
    }

    const applicationHooks = this.searchHelper(source, ApplicationHookNames);

    for (const hook of applicationHooks) {
      this.validateHooks(hook);
    }

    const lifecycleHooks = this.searchHelper(source, LifecycleHookNames);

    for (const hook of applicationHooks) {
      this.validateHooks(hook);
    }

    return {
      async,
      type,
      providerPath: cwdRelative(path.relative(this.config.cwd, source.fileName)),
      parameters,
      schemaTransformer: !!schemaTransformer,
      applicationHooks: applicationHooks.map((h) => h.name!.text),
      lifecycleHooks: lifecycleHooks.map((h) => h.name!.text)
    };
  }

  private searchHelper(source: ts.SourceFile, fnNames: readonly string[]) {
    const hooks = [];

    for (const statement of source.statements) {
      if (!ts.isFunctionDeclaration(statement)) {
        continue;
      }

      for (const name of fnNames) {
        if (nodeNameEquals(statement, name)) {
          hooks.push(statement);
          break;
        }
      }
    }

    return hooks;
  }

  private validateSchemaTransformer(schemaTransformer: ts.FunctionDeclaration) {
    if (!isExportedFunction(schemaTransformer)) {
      throw new InvalidProviderSchemaTransformerError(schemaTransformer.name || schemaTransformer, 'please export it.');
    }

    if (schemaTransformer.parameters.length < 1) {
      throw new InvalidProviderSchemaTransformerError(
        schemaTransformer.name || schemaTransformer,
        'it must receive the schema as the first parameter.'
      );
    }

    if (schemaTransformer.parameters.length > 2) {
      throw new InvalidProviderSchemaTransformerError(
        schemaTransformer.name || schemaTransformer,
        'only RouteSchema and ProviderGenerics are allowed as parameters.'
      );
    }

    if (getTypeNodeName(schemaTransformer.parameters[0]!) !== 'RouteSchema') {
      throw new InvalidProviderSchemaTransformerError(
        schemaTransformer.parameters[0]!.type ||
          schemaTransformer.parameters[0]!.name ||
          schemaTransformer.name ||
          schemaTransformer,
        'the first parameter must be of type `RouteSchema`.'
      );
    }

    // provider generics
    if (schemaTransformer.parameters[1]) {
      if (getTypeNodeName(schemaTransformer.parameters[1]!) !== 'ProviderGenerics') {
        throw new InvalidProviderSchemaTransformerError(
          schemaTransformer.parameters[1]!.type ||
            schemaTransformer.parameters[1]!.name ||
            schemaTransformer.name ||
            schemaTransformer,
          'if the second parameter is present, its type must be `ProviderGenerics`.'
        );
      }
    }

    if (!schemaTransformer.type || getTypeNodeName(schemaTransformer) !== 'RouteSchema') {
      throw new InvalidProviderSchemaTransformerError(
        schemaTransformer.type || schemaTransformer.name || schemaTransformer,
        'it must have the `RouteSchema` return type explicitly.'
      );
    }
  }

  private validateHooks(hook: ts.FunctionDeclaration) {
    if (!isExportedFunction(hook)) {
      throw new InvalidProviderHookError(hook.name || hook, 'please export it.');
    }

    if (!hook.modifiers.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword)) {
      throw new InvalidProviderHookError(hook.name || hook, 'please it hook async.');
    }

    // TODO: fastify@5.
    // https://github.com/fastify/fastify/issues/4967
    // Parameters are inconsistent across hooks. Until fastify@5 is released,
    // I do not think validating them is worth it.
  }
}
