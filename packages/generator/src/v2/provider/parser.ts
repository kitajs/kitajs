import ts from 'typescript';
import { NoProviderExported, ParameterResolverNotFound, UntypedProvider } from '../errors';
import { BaseProvider } from '../models';
import { ParameterParser } from '../parsers';
import { getTypeName, isDefaultExportFunction, toPrettySource, unwrapPromiseType } from '../util/nodes';

export async function parseProvider(source: ts.SourceFile, paramParser: ParameterParser): Promise<BaseProvider> {
  const fn = source.statements.find(isDefaultExportFunction);

  if (!fn) {
    throw new NoProviderExported(source.fileName);
  }

  if (!fn.type) {
    throw new UntypedProvider(source.fileName);
  }

  const returnType = unwrapPromiseType(fn.type);
  const async = fn.type !== returnType;
  const type = getTypeName(returnType);

  if (!type) {
    throw new UntypedProvider(source.fileName);
  }

  const parameters = [];

  // TODO: Transform this to an async iterator to handle parameters asynchronously
  for (const [index, param] of fn.parameters.entries()) {
    const supports = await paramParser.supports(param);

    if (!supports) {
      throw new ParameterResolverNotFound( toPrettySource(param));
    }

    parameters[index] = await paramParser.parse(param, null, fn, index);
  }

  return {
    async,
    type,
    providerPath: source.fileName,
    parameters,
    schemaTransformer: false
  };
}
