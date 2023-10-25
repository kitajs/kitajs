import {
  InvalidProviderSchemaTransformerError,
  KitaConfig,
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
  hasName,
  isDefaultExportFunction,
  isExportedFunction,
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

    const schemaTransformer = source.statements.find(
      (s) => ts.isFunctionDeclaration(s) && hasName(s, 'transformSchema')
    ) as ts.FunctionDeclaration | undefined;

    // validations
    if (schemaTransformer) {
      if (!isExportedFunction(schemaTransformer)) {
        throw new InvalidProviderSchemaTransformerError(
          schemaTransformer.name || schemaTransformer,
          'please export this function.'
        );
      }

      if (schemaTransformer.parameters.length < 1) {
        throw new InvalidProviderSchemaTransformerError(
          schemaTransformer.name || schemaTransformer,
          'it must receive the schema as the first parameter.'
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

      if (!schemaTransformer.type || getTypeName(schemaTransformer) !== 'RouteSchema') {
        throw new InvalidProviderSchemaTransformerError(
          schemaTransformer.type || schemaTransformer.name || schemaTransformer,
          'it must have the `RouteSchema` return type explicitly.'
        );
      }
    }

    return {
      async,
      type,
      providerPath: cwdRelative(path.relative(this.config.cwd, source.fileName)),
      parameters,
      schemaTransformer: !!schemaTransformer
    };
  }
}
