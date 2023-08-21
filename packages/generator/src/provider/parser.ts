import ts from 'typescript';
import { kTransformSchema } from '../constants';
import { NoProviderExportedError, ParameterResolverNotFoundError, UntypedProviderError } from '../errors';
import { BaseProvider } from '../models';
import { ParameterParser } from '../parsers';
import {
  getTypeName,
  hasName,
  isDefaultExportFunction,
  isExportedFunction,
  toPrettySource,
  unwrapPromiseType
} from '../util/nodes';

export async function parseProvider(source: ts.SourceFile, paramParser: ParameterParser): Promise<BaseProvider> {
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

  const parameters = [];

  // TODO: Transform this to an async iterator to handle parameters asynchronously
  for (const [index, param] of fn.parameters.entries()) {
    const supports = await paramParser.supports(param);

    if (!supports) {
      throw new ParameterResolverNotFoundError(toPrettySource(param));
    }

    parameters[index] = await paramParser.parse(param, null, fn, index);
  }

  const hasSchemaTransformer = !!source.statements.find((s) => isExportedFunction(s) && hasName(s, kTransformSchema));

  return {
    async,
    type,
    providerPath: source.fileName,
    parameters,
    schemaTransformer: hasSchemaTransformer
  };
}
