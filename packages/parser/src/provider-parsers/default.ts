import {
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
import { getTypeName, hasName, isDefaultExportFunction, isExportedFunction, unwrapPromiseType } from '../util/nodes';
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

    const hasSchemaTransformer = !!source.statements.find(
      (s) => isExportedFunction(s) && hasName(s, 'transformSchema')
    );

    return {
      async,
      type,
      providerPath: cwdRelative(path.relative(this.config.cwd, source.fileName)),
      parameters,
      schemaTransformer: hasSchemaTransformer
    };
  }
}
