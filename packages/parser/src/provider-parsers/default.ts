import {
  NoProviderExportedError,
  ParameterParser,
  Provider,
  ProviderParser,
  UntypedProviderError
} from '@kitajs/common';
import { Promisable } from 'type-fest';
import ts from 'typescript';
import {
  getTypeName,
  hasName,
  isDefaultExportFunction,
  isExportedFunction,
  toPrettySource,
  unwrapPromiseType
} from '../util/nodes';
import { traverseParameters } from '../util/traverser';

export class DefaultProviderParser implements ProviderParser {
  constructor(private paramParser: ParameterParser) {}

  // TODO: Implement this
  supports(_: ts.SourceFile): Promisable<boolean> {
    return true;
  }

  async parse(source: ts.SourceFile): Promise<Provider> {
    const fn = source.statements.find(isDefaultExportFunction);

    if (!fn) {
      throw new NoProviderExportedError(source.fileName);
    }

    if (!fn.type) {
      throw new UntypedProviderError(toPrettySource(fn));
    }

    const returnType = unwrapPromiseType(fn.type);
    const async = fn.type !== returnType;
    const type = getTypeName(returnType);

    // Not a type reference.
    if (returnType.kind !== ts.SyntaxKind.TypeReference || !type) {
      throw new UntypedProviderError(toPrettySource(returnType));
    }

    const parameters = Array(fn.parameters.length);

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
      providerPath: source.fileName,
      providerPrettyPath: toPrettySource(fn),
      parameters,
      schemaTransformer: hasSchemaTransformer
    };
  }
}
